import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { Router } from '@angular/router';
import { AdminService } from '@core/services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ForgotPasswordComponent implements OnInit {
  emailVar;
  coreConfig: any;
  forgotPasswordForm: FormGroup;
  submitted = false;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private adminService: AdminService,
    private _router: Router,
    private toast : ToastrService
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  loading = false
  error = ''
  onSubmit() {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.submitted = false
    let data = JSON.parse(JSON.stringify(this.forgotPasswordForm.value))
    this.loading = true
    this.adminService.forgetPassword(data).subscribe((res) => {
      this.toast.success(`Password email sent succesfully`, `Check Inbox`, {
        toastClass: 'toast ngx-toastr',
        closeButton: true
    });
      this.loading = false
    })
    
    
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.resetLocalStorage();
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  resetLocalStorage() {
    const config = localStorage.getItem('config');
    localStorage.clear();
    console.log('Setting from forgot')
    localStorage.setItem('config', config)
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
