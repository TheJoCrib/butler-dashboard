import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JobComponent } from "./job/job.component";
import { JobDetailsViewComponent } from "./job-details-view/job-details-view.component";
import { CreateJobComponent } from "./create-job/create-job.component";
import { AuthGuard } from "@core/services/authentication/auth-guard.service";
import { PERMISSIONS } from "@core/utilities/constants";

const routes: Routes = [
  {
    path: "",
    component: JobComponent,
    canActivate: [AuthGuard],
    data: { permission: PERMISSIONS.VIEW_JOB },
  },
  {
    path: "create",
    canActivate: [AuthGuard],
    data: { permission: PERMISSIONS.CREATE_JOB },
    component: CreateJobComponent,
  },
  {
    path: "details-view/:id",
    canActivate: [AuthGuard],
    data: { permission: PERMISSIONS.UPDATE_JOB },
    component: JobDetailsViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobRoutingModule {}
