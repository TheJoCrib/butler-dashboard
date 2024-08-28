import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { AdminService } from "@core/services/admin/admin.service";
import { RoleService } from "@core/services/role/role.service";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { ToastrService } from "ngx-toastr";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import Swal from "sweetalert2";
import _ from "lodash";
import { AuthGuard } from "@core/services/authentication/auth-guard.service";
import { PERMISSIONS } from "@core/utilities/constants";

@Component({
  selector: "app-admin-management",
  templateUrl: "./admin-management.component.html",
  styleUrls: ["./admin-management.component.scss"],
})
export class AdminManagementComponent implements OnInit {
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  contentHeader: object;
  Admintatus = "pending";
  breadcrumbTitle = "Registration Requests";
  tempData = [];
  selected = [];
  ColumnMode = ColumnMode;
  admins = [];
  confPerm = PERMISSIONS;
  query = {};
  basicSelectedOption: number = 50;
  showAddUpdateAdminDiv = false;
  loader = false;
  pageSize = 10;
  offset = 0;
  AdminDetailsForm: FormGroup;
  roles = [];
  @ViewChild("tableRowDetails") tableRowDetails: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  totalAdmins = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private toast: ToastrService,
    private roleService: RoleService,
    private authGuardService: AuthGuard,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.inItContentHeader();
    this.getRoles();
    this.getAdmins();
    this.initAdminForm();

    this.dropdownSettings = {
      singleSelection: true,
      idField: "_id",
      textField: "title",
      itemsShowLimit: 2,
      allowRemoteDataSearch: true,
      allowSearchFilter: true,
    };
  }
  getRoles(q?: String) {
    this.roleService.getRoles({ q: q || "" }).subscribe((res: any) => {
      this.roles = res.data;
    });
  }
  onSearch(e: any) {
    this.getRoles(e);
  }
  getAdmins() {
    this.loading = true;
    this.adminService.getAdmins(this.query).subscribe((res: any) => {
      this.admins = res.data;
      this.totalAdmins = res.totalCount
      this.loading = false;
    });
  }
  setPage(pageInfo) {
    this.offset = pageInfo.offset;
    this.query = { ...this.query, pageNo: this.offset + 1 };
    this.getAdmins();
  }

  selectedAdmin: any;
  toggleAdminStatus(admin: any) {
    if (!this.checkPermission(this.confPerm.UPDATE_ADMIN)) {
      return;
    }
    this.loading = true;
    this.adminService
      .update(admin._id, { isBanned: !admin.isBanned })
      .subscribe((res) => {
        this.getAdmins();
      });
  }

  handleLimit() {
    this.offset = 0;
    this.query = { ...this.query, pageSize: this.pageSize, pageNo: 1 };
    this.getAdmins();
  }

  inItContentHeader() {
    this.contentHeader = {
      headerTitle: "Control Panel",
      actionButton: false,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Admin Management",
            isLink: false,
          },
        ],
      },
    };
  }

  filterUpdate(event) {
    this.query = { ...this.query, q: event.target.value };
    _.debounce(() => {
      this.getAdmins();
    }, 500)();
  }
  checkPermission(permission) {
    return this.authGuardService.checkPermisison(permission);
  }
  buttonText = "Submit";
  cardTitle = "Add Admin Details";
  editAdmin(Admin) {
    this.submitted = false;
    this.cardTitle = "Update Admin Details";
    this.buttonText = "Update";
    this.selectedAdmin = Admin;
    this.showAddUpdateAdminDiv = !this.showAddUpdateAdminDiv;
    this.initAdminForm(Admin);
  }

  addNewAdmin() {
    this.initAdminForm();
    this.cardTitle = "Add Admin Details";
    this.buttonText = "Submit";
    this.submitted = false;
    this.showAddUpdateAdminDiv = !this.showAddUpdateAdminDiv;
  }

  get f() {
    return this.AdminDetailsForm.controls;
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
  initAdminForm(Admin?: any) {
    if (Admin) {
      Admin.roleId = [{ title: Admin.role[0].title, _id: Admin.role[0]._id }];
      this.AdminDetailsForm = this._formBuilder.group({
        email: [Admin.email, [Validators.required, Validators.email]],
        roleId: [Admin.roleId, [Validators.required]],
        fullName: [Admin.fullName, [Validators.required]],
        password: [
          "",
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
      });
    } else {
      this.AdminDetailsForm = this._formBuilder.group({
        email: ["", [Validators.required, Validators.email]],
        roleId: ["", [Validators.required]],
        fullName: ["", [Validators.required]],
        password: [
          "",
          Validators.compose([
            Validators.required,
            this.patternValidator(/\d/, { hasNumber: true }),
            this.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
            this.patternValidator(/[a-z]/, { hasSmallCase: true }),
            Validators.minLength(8),
          ]),
        ],
      });
    }
  }

  error = "";
  loading = false;
  submitted = false;
  onSubmit() {
    this.loader = true;
    this.submitted = true;
    if (this.AdminDetailsForm.invalid) {
      this.loader = false;
      return;
    }
    this.submitted = false;
    let data = JSON.parse(JSON.stringify(this.AdminDetailsForm.value));
    if (this.buttonText != "Submit") {
      data["role"] = data.roleId[0]["_id"];
      delete data["roleId"];
      this.updateAdminDetails(data);
      this.loader = false;
      return;
    } else {
      data["role"] = data.roleId[0]["_id"];
      delete data["roleId"];
      this.createAdmin(data);
      this.loader = false;
    }
  }
  createAdmin(admin) {
    this.adminService.create(admin).subscribe((res) => {
      this.toast.success(
        `Admin created succesfully`,
        "Created",
        {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        }
      );
      this.showAddUpdateAdminDiv = !this.showAddUpdateAdminDiv;
      this.getAdmins();
    });
  }
  updateAdminDetails(admin) {
    this.adminService.update(this.selectedAdmin._id, admin).subscribe((res) => {
      this.toast.success(
        `"${admin.fullName}" updated succesfully`,
        "Updated",
        {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        }
      );
      this.showAddUpdateAdminDiv = !this.showAddUpdateAdminDiv;
      this.getAdmins();
    });
  }
  deleteAdmin(admin: any) {
    Swal.fire({
      title: `Are you sure? You sure you want to delete ${admin.fullName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7367F0",
      cancelButtonColor: "#E42728",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-primary ml-1",
      },
    }).then((result: any) => {
      if (result.value) {
        this.adminService.delete(admin._id).subscribe((res) => {
          this.toast.success(
            `${admin.fullName} deleted successfully`,
            `Deleted`,
            {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            }
          );
          this.getAdmins();
        });
      }
    });
  }
}
