import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "@core/services/authentication/auth-guard.service";
import {PERMISSIONS} from "@core/utilities/constants";
import {ReviewsListingComponent} from "./reviews-listing/reviews-listing.component";
import {ReviewDetailsViewComponent} from "./reviews-details-view/review-details-view.component";

const routes: Routes = [
    {
        path: "",
        component: ReviewsListingComponent,
        canActivate: [AuthGuard],
        data: {permission: PERMISSIONS.VIEW_USER},
    },
    {
        path: "details-view/:id",
        component: ReviewDetailsViewComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReviewsRoutingModule {
}
