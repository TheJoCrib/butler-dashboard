import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { User } from '@core/models/common-models';


@Injectable({
  providedIn: 'root'
})
export class CoreMenuService {
  currentUser: User;
  onItemCollapsed: Subject<any>;
  onItemCollapseToggled: Subject<any>;

  // Private
  private _onMenuRegistered: BehaviorSubject<any>;
  private _onMenuUnregistered: BehaviorSubject<any>;
  private _onMenuChanged: BehaviorSubject<any>;
  private _currentMenuKey: string;
  private _registry: { [key: string]: any } = {};

  constructor(private _router: Router) {

    // Set defaults
    this.onItemCollapsed = new Subject();
    this.onItemCollapseToggled = new Subject();

    // Set private defaults
    this._currentMenuKey = null;
    this._onMenuRegistered = new BehaviorSubject(null);
    this._onMenuUnregistered = new BehaviorSubject(null);
    this._onMenuChanged = new BehaviorSubject(null);
  }

  // Accessors
  // -----------------------------------------------------------------------------------------------------

  get onMenuRegistered(): Observable<any> {
    return this._onMenuRegistered.asObservable();
  }

  get onMenuUnregistered(): Observable<any> {
    return this._onMenuUnregistered.asObservable();
  }

  get onMenuChanged(): Observable<any> {
    return this._onMenuChanged.asObservable();
  }

  // Public methods
  // -----------------------------------------------------------------------------------------------------


  register(key, menu): void {
    // Confirm if the key already used
    if (this._registry[key]) {
      console.error(`Menu with the key '${key}' already exists. Either unregister it first or use a unique key.`);

      return;
    }

    // Add to registry
    this._registry[key] = menu;

    // Notify subject
    this._onMenuRegistered.next([key, menu]);
  }

  unregister(key): void {
    // Confirm if the menu exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);
    }

    // Unregister sidebar
    delete this._registry[key];

    // Notify subject
    this._onMenuUnregistered.next(key);
  }

  getMenu(key): any {
    // Confirm if the menu exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Return sidebar
    return this._registry[key];
  }

  getCurrentMenu(): any {
    if (!this._currentMenuKey) {
      console.warn(`The current menu is not set.`);

      return;
    }

    return this.getMenu(this._currentMenuKey);
  }

  setCurrentMenu(key): void {
    // Confirm if the sidebar exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Set current menu key
    this._currentMenuKey = key;

    // Notify subject
    this._onMenuChanged.next(key);
  }

}
