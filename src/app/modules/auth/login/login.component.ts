import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import jwt_decode from "jwt-decode";
import {CoreConfigService} from '@core/services/config.service';
import {CommonService} from '@core/services/common.service';
//import { UserService } from '@core/services/user/user.service';
import {ToastrService} from 'ngx-toastr';
import {AdminService} from '@core/services/admin/admin.service';

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
    //  Public
    coreConfig: any;
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl = "/dashboard";
    error = "";
    passwordTextType: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _coreConfigService: CoreConfigService,
        private _formBuilder: FormBuilder,
        private toast: ToastrService,
        private _route: ActivatedRoute,
        private _router: Router,
        public commonService: CommonService,
        private adminService: AdminService
    ) {
        this._unsubscribeAll = new Subject();
        // Configure the layout
        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                menu: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                customizer: false,
                enableLocalStorage: false,
            },
        };
    }

    get f() {
        return this.loginForm.controls;
    }

    togglePasswordTextType() {
        this.passwordTextType = !this.passwordTextType;
    }

    ngOnInit(): void {
        this.resetLocalStorage();
        this.loginForm = this._formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", Validators.required],
        });

        // Subscribe to config changes
        this._coreConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.coreConfig = config;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSubmit() {
        // this._router.navigate(["/dashboard"]);

        this.submitted = true;
        this.error = "";
        // console.log(this.loginForm.value)
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        try {
            this.loading = true
            let data = JSON.parse(JSON.stringify(this.loginForm.value))
            this.adminService.login(data).subscribe((res: any) => {
                var decoded: any = jwt_decode(res.accessToken);
                localStorage.setItem('access_token', res.accessToken)
                localStorage.setItem('admin', JSON.stringify(decoded))
                this.loading = false
                this.toast.success(`welcome to the butler dashboard`, `Hi ${decoded.fullName}`, {
                    toastClass: 'toast ngx-toastr',
                    closeButton: true
                });
                this._router.navigate(['/admin/dashboard'])
            })
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
    }

    resetLocalStorage() {
        const config = localStorage.getItem('config');
        localStorage.clear();
        localStorage.setItem('config', config)
        localStorage.setItem('selected_skin', 'dark')

    }
}
