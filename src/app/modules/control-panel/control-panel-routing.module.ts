import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/services/authentication/auth-guard.service";
import { PERMISSIONS } from "@core/utilities/constants";
import { AdminManagementComponent } from "./admin-management/admin-management.component";
import { CategoryManagmentComponent } from "./category-managment/category-managment.component";
import { RoleManagmentComponent } from "./role-managment/role-managment.component";

const routes: Routes = [
  {
    path: "admin-management",
    canActivate: [AuthGuard],
    data: { permission: PERMISSIONS.VIEW_ADMIN },
    component: AdminManagementComponent,
  },
  {
    path: "role-management",

    canActivate: [AuthGuard],
    data: { permission: PERMISSIONS.VIEW_ROLE },
    component: RoleManagmentComponent,
  },/*
  {
    path: "category-management",
    canActivate: [AuthGuard],
    data: { permission: PERMISSIONS.VIEW_CATEGORY },
    component: CategoryManagmentComponent,
  },*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlPanelRoutingModule {}
