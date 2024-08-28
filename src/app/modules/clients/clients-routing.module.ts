import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@core/services/authentication/auth-guard.service";
import { PERMISSIONS } from "@core/utilities/constants";
import { ClientDetailsViewComponent } from "./clients-details-view/client-details-view.component";
import { ClientListingComponent } from "./clients-listing/client-listing.component";

const routes: Routes = [
  {
    path: "",
    component: ClientListingComponent,
    canActivate: [AuthGuard],
    data: { breadcrumbTitle: "Clients",permission: PERMISSIONS.VIEW_USER },
  },
  { path: "details-view/:id", component: ClientDetailsViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
