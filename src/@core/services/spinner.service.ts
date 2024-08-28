import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class SpinnerService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor() {
    }

    show(): void {
        this.loadingSubject.next(true);
    }

    hide(): void {
        setTimeout(()=>{
            this.loadingSubject.next(false);
        },500);
    }
}

