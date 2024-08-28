import {Component, OnInit} from '@angular/core';
import {SpinnerService} from "../../../../@core/services/spinner.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
    constructor(private router:Router) {
    }
ngOnInit() {
        this.router.navigateByUrl('admin/dashboard')
}
}
