import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "@core/services/authentication/auth-guard.service";
import {PERMISSIONS} from "@core/utilities/constants";
import {RequestListingComponent} from "./request-listing/requests-listing.component";
import {RequestDetailsViewComponent} from "./request-details-view/request-details-view.component";

const routes: Routes = [
    {
        path: "",
        component: RequestListingComponent,
        canActivate: [AuthGuard],
        data: {permission: PERMISSIONS.VIEW_USER},
    },
    {
        path: "details-view/:id",
        component: RequestDetailsViewComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DesignerRequestsRoutingModule {
}
