import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from "@angular/forms";
import {AdminService} from "@core/services/admin/admin.service";
import {MustMatch} from "@core/utilities/must-match";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {MustDifferent} from "../../../../@core/utilities/must-different";

@Component({
    selector: "app-change-password",
    templateUrl: "./change-password.component.html",
    styleUrls: ["./change-password.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ChangePasswordComponent implements OnInit {
    oldPasswordTextType: boolean;
    passwordTextType: boolean;
    confPasswordTextType: boolean;
    changePasswordForm: FormGroup;
    submitted = false;
    specialChar = '(:;"[{]}|,<.>/?`~)';

    constructor(
        private _formBuilder: FormBuilder,
        private adminService: AdminService,
        private toast: ToastrService
    ) {
    }

    get f() {
        return this.changePasswordForm.controls;
    }

    changeFieldType(type) {
        this[type] = !this[type];
    }

    ngOnInit(): void {
        this.changePasswordForm = this._formBuilder.group(
            {
                oldPassword: ["", [Validators.required]],
                newPassword: [
                    null,
                    Validators.compose([
                        Validators.required,
                        // 2. check whether the entered password has a number
                        this.patternValidator(/\d/, {hasNumber: true}),
                        // 3. check whether the entered password has upper case letter
                        this.patternValidator(/[A-Z]/, {hasCapitalCase: true}),
                        // 4. check whether the entered password has a lower-case letter
                        this.patternValidator(/[a-z]/, {hasSmallCase: true}),
                        // 6. Has a minimum length of 8 characters
                        Validators.minLength(8),
                    ]),
                ],
                // newPassword: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ["", [Validators.required]],
            },
            {
                validators: [MustMatch("newPassword", "confirmPassword"), MustDifferent("oldPassword", "confirmPassword")],
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

    error = "";
    loading = false;

    onSubmit() {
        this.submitted = true;
        if (this.changePasswordForm.invalid) {
            return;
        }
        this.submitted = false;
        this.loading = true;
        let data = JSON.parse(JSON.stringify(this.changePasswordForm.value));
        let admin: any = localStorage.getItem("admin");
        admin = JSON.parse(admin);
        let token = localStorage.getItem("access_token");
        this.adminService
            .login({email: admin.email, password: data.oldPassword})
            .subscribe((res) => {
                this.adminService
                    .changePassword({
                        token: token,
                        password: data.newPassword,
                    })
                    .subscribe((res) => {
                        this.toast.success(
                            `Your password has been changed`,
                            `Updated  Succesfully`,
                            {
                                toastClass: "toast ngx-toastr",
                                closeButton: true,
                            }
                        );
                        this.changePasswordForm.reset(true, {emitEvent: false})
                    });
            });
        this.loading = false;
    }
}
