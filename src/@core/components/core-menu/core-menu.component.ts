import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation,} from "@angular/core";

import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

import {CoreMenuService} from "@core/components/core-menu/core-menu.service";
import {AuthGuard} from "@core/services/authentication/auth-guard.service";

@Component({
    selector: "[core-menu]",
    templateUrl: "./core-menu.component.html",
    styleUrls: ["./core-menu.component.scss"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreMenuComponent implements OnInit {
    currentUser: any;

    @Input()
    layout = "vertical";

    @Input()
    menu: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private authGuardService: AuthGuard,
        private _coreMenuService: CoreMenuService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Set the menu either from the input or from the service
        this.menu = this.menu || this._coreMenuService.getCurrentMenu();

        // Subscribe to the current menu changes
        this._coreMenuService.onMenuChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.currentUser = this._coreMenuService.currentUser;

                // Load menu
                this.menu = this._coreMenuService.getCurrentMenu();

                this._changeDetectorRef.markForCheck();
            });
    }

    checkPermission(menu) {
        if (menu.permission) {
            return this.authGuardService.checkPermisison(menu.permission);
        } else {
            return true;
        }
    }
}
