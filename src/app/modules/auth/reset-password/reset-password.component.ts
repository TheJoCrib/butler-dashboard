import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CoreConfigService } from "@core/services/config.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MustMatch } from "@core/utilities/must-match";
import { CommonService } from "@core/services/common.service";
import { ToastrService } from "ngx-toastr";
import { AdminService } from "@core/services/admin/admin.service";
import jwtDecode from "jwt-decode";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ResetPasswordComponent implements OnInit {
  coreConfig: any;
  passwordTextType: boolean;
  confPasswordTextType: boolean;
  resetPasswordForm: FormGroup;
  submitted = false;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private toast: ToastrService,
    public commonService: CommonService,
    private adminService: AdminService,
    private _router: Router,
    private _route: ActivatedRoute
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

  // convenience getter for easy access to form fields
  get f() {
    return this.resetPasswordForm.controls;
  }
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  toggleConfPasswordTextType() {
    this.confPasswordTextType = !this.confPasswordTextType;
  }

  changeFieldType(type) {
    this[type] = !this[type];
  }

  error = "";
  loading = false;
  onSubmit() {
    this.submitted = true;
    this.error = "";
    if (this.resetPasswordForm.invalid) {
      return;
    }
    let data = JSON.parse(JSON.stringify(this.resetPasswordForm.value));
    this.adminService
      .changePassword({
        token: this.requestToken,
        password: data.newPassword,
      })
      .subscribe((res: any) => {
        var decoded: any = jwtDecode(res.accessToken);
        localStorage.setItem("access_token", res.accessToken);
        localStorage.setItem("admin", JSON.stringify(decoded));
        this.loading = false;
        this.toast.success(
          `Password update successfully`,
          `Hi ${decoded.fullName}`,
          {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          }
        );
        this._router.navigate(["/admin/dashboard"]);
      });
  }

  ngOnInit(): void {
    this.resetLocalStorage();
    this._route.params.subscribe((params) => {
      if (params["request-token"]) {
        this.requestToken = params["request-token"];
        this.inItResetForm();
        console.log("Hi this is request Token-->", params["request-token"]);
      }
    });
    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });
  }
  requestToken = "";
  // this validator will be improved with new RX..
  inItResetForm() {
    this.resetPasswordForm = this._formBuilder.group(
      {
        requestToken: [this.requestToken, [Validators.required]],
        newPassword: [
          null,
          Validators.compose([
            Validators.required,
            // 2. check whether the entered password has a number
            this.patternValidator(/\d/, { hasNumber: true }),
            // 3. check whether the entered password has upper case letter
            this.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
            // 4. check whether the entered password has a lower-case letter
            this.patternValidator(/[a-z]/, { hasSmallCase: true }),
            // 6. Has a minimum length of 8 characters
            Validators.minLength(8),
          ]),
        ],
        // newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validator: MustMatch("newPassword", "confirmPassword"),
      }
    );
  }

  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  resetLocalStorage() {
    const config = localStorage.getItem('config');
    localStorage.clear();
    localStorage.setItem('config', config)
  }
}
