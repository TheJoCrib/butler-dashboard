import { HttpResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PermissionsService } from "@core/services/permissions/permissions.service";
import { RoleService } from "@core/services/role/role.service";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { ToastrService } from "ngx-toastr";
import _ from "lodash";
import Swal from "sweetalert2";
import { PERMISSIONS } from "@core/utilities/constants";
import { AuthGuard } from "@core/services/authentication/auth-guard.service";
@Component({
  selector: "app-role-managment",
  templateUrl: "./role-managment.component.html",
  styleUrls: ["./role-managment.component.scss"],
})
export class RoleManagmentComponent implements OnInit {
  showAddUpdateRoleDiv = false;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  confPerm = PERMISSIONS;
  contentHeader: object;
  allPermissions = [];
  roles = [];
  selectedRoleId = "";
  pageSize = 10;
  buttonText = "Submit";
  query = {};
  //these are hardcoded types for permissions
  permissionTypes: any;
  ColumnMode = ColumnMode;
  basicSelectedOption: number = 50;
  columns = [{ prop: "name" }, { name: "Gender" }, { name: "Company" }];
  loader = false;
  RoleForm: FormGroup;

  //  @ViewChild("tableRowDetails") tableRowDetails: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  offset = 0;
  totalRoles = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private toast: ToastrService,
    private permissionService: PermissionsService,
    private roleService: RoleService,
    private authGuardService: AuthGuard
  ) {}

  ngOnInit(): void {
    this.inItContentHeader();
    this.query = { ...this.query, pageSize: this.pageSize };
    this.getRoles();
    this.initRoleForm();
    this.getAllPermissons();
  }
  filterUpdate(event) {
    this.query = { ...this.query, q: event.target.value };
    _.debounce(() => {
      this.getRoles();
    }, 500)();
  }
  handleLimit() {
    this.offset = 0;
    this.query = { ...this.query, pageSize: this.pageSize, pageNo: 1 };
    this.getRoles();
  }
  setPage(pageInfo) {
    this.offset = pageInfo.offset;
    this.query = { ...this.query, pageNo: this.offset + 1 };
    this.getRoles();
  }
  getRoles() {
    this.roleService.getRoles(this.query).subscribe((res: any) => {
      this.roles = res.data;
      this.totalRoles = res.totalCount
    });
  }
  getAllPermissons() {
    this.permissionService.getPermissions().subscribe((res: any) => {
      this.allPermissions = res.data;
      this.permissionTypes = new Set(res.data.map((e) => e.split(".")[1]));
      this.allPermissions = this.allPermissions.map((ele) => {
        return {
          value: ele,
          text: ele.split(".").join(" "),
          type: ele.split(".")[1],
        };
      });
    });
  }

  inItContentHeader() {
    this.contentHeader = {
      headerTitle: "Control Panel",
      actionButton: false,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Role Management",
            isLink: false,
          },
        ],
      },
    };
  }

  cardTitle = "Add Role Details";

  addNewRole() {
    this.initRoleForm();
    this.buttonText = "Submit";
    this.cardTitle = "Add Role Details";
    this.showAddUpdateRoleDiv = !this.showAddUpdateRoleDiv;
  }

  get f() {
    return this.RoleForm.controls;
  }
  handlePermToggle(evnt, perm) {
    let temp = this.RoleForm.get("permissions").value;
    if (evnt.target.checked) {
      temp.push(perm);
      this.RoleForm.get("permissions").setValue(temp);
    } else {
      temp = temp.filter((p) => p !== perm);
      this.RoleForm.get("permissions").setValue(temp);
    }
  }
  isChecked(perm) {
    //when we edit a role we check if the permission exists or not
    let rolePerms = this.RoleForm.get("permissions").value;
    if (
      rolePerms &&
      rolePerms.length &&
      rolePerms.findIndex((p) => p === perm) > -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  initRoleForm(role?: any) {
    if (role) {
      this.RoleForm = this._formBuilder.group({
        title: [role.title, [Validators.required]],
        description: [role.description, [Validators.required]],
        permissions: [role.permissions, [Validators.minLength(1)]],
      });
    } else {
      this.RoleForm = this._formBuilder.group({
        title: ["", [Validators.required]],
        description: ["", [Validators.required]],
        permissions: [[], [Validators.required]],
      });
    }
  }

  error = "";
  loading = false;
  submitted = false;
  onSubmit() {
    this.submitted = true;
    if (this.RoleForm.invalid) {
      return;
    }
    let data = JSON.parse(JSON.stringify(this.RoleForm.value));
    this.loader = true;
    if (this.buttonText != "Submit") {
      this.updateRoleDetails();
      return;
    }

    this.roleService.create(data).subscribe((res) => {
      this.loader = false;
      this.submitted = false;
      this.initRoleForm();
      this.showAddUpdateRoleDiv = false;
      this.toast.success(
        `role "${data.title}" created succesfully`,
        "Created",
        {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        }
      );
      this.getRoles();
    });
  }

  updateRoleDetails() {
    let payLoad = JSON.parse(JSON.stringify(this.RoleForm.value));
    this.roleService.update(this.selectedRoleId, payLoad).subscribe((res) => {
      this.loader = false;
      this.submitted = false;
      this.initRoleForm();
      this.showAddUpdateRoleDiv = false;
      this.toast.success(
        `role "${payLoad.title}" updated succesfully`,
        "Updated",
        {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        }
      );
    });
    this.getRoles();
  }
  checkPermission(permission) {
    return this.authGuardService.checkPermisison(permission);
  }
  editRole(role) {
    this.submitted = false;
    this.selectedRoleId = role._id;
    this.cardTitle = "Update Role Details";
    this.buttonText = "Update";
    this.showAddUpdateRoleDiv = !this.showAddUpdateRoleDiv;
    this.initRoleForm(role);
  }
  deleteRole(role: any) {
    Swal.fire({
      title: `Are you sure? You sure you want to delete ${role.title}`,
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
        this.roleService.delete(role._id).subscribe((res) => {
          this.toast.success(`${role.title} deleted successfully`, `Deleted`, {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.getRoles();
        });
      }
    });
  }
}
