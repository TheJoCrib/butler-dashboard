import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/services/authentication/auth-guard.service";
import { PERMISSIONS } from "@core/utilities/constants";
import { FreelancerDetailsViewComponent } from "./freelancer-details-view/freelancer-details-view.component";
import { FreelancersListingComponent } from "./freelancers-listing/freelancers-listing.component";

const routes: Routes = [
  {
    path: "",
    component: FreelancersListingComponent,
    canActivate: [AuthGuard],
    data: { permission: PERMISSIONS.VIEW_USER },
  },
  {
    path: "details-view/:id",
    component: FreelancerDetailsViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreelancersRoutingModule {}
