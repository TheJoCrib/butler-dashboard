import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../../@core/services/authentication/auth-guard.service";
import {AdminComponent} from "./admin/admin.component";
import {AuthGuardAdminService} from "../../../@core/services/authentication/auth-guard-admin.service";
import {ReviewsModule} from "../reviews/reviews.module";
import {DesignerRequestsModule} from "../designer_requests/designer_requests.module";

const routes: Routes = [
    {
        path: "", component: AdminComponent,
        canActivate: [AuthGuardAdminService],
        children: [
            {
                path: "dashboard",
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import("../dashboard/dashboard.module").then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: "jobs",
                canActivate: [AuthGuard],
                loadChildren: () => import("../jobs/job.module")
                    .then(m => m.JobModule),
            },
            {
                path: "invoices",
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import("../invoices/invoices.module").then(
                        (m) => m.InvoicesModule
                    ),
            },
            {
                path: 'chats',
                canActivate: [AuthGuard],
                loadChildren: () => import('../chat/chat.module').then(m => m.ChatModule)
            },
            {
                path: "control-panel",
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import("../control-panel/control-panel.module").then(
                        (m) => m.ControlPanelModule
                    ),
            },
            {
                path: "payments",
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import("../payments/payments.module").then(
                        (m) => m.PaymentsModule
                    ),
            },
            {
                path: 'clients',
                canActivate: [AuthGuard],
                loadChildren: () => import('../clients/clients.module')
                    .then(m => m.ClientsModule),
            },
            {
                path: "freelancers",
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import("../freelancers/freelancers.module").then(
                        (m) => m.FreelancersModule
                    ),
            },
            {
                path: "reviews",
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import("../reviews/reviews.module").then(
                        (m) => m.ReviewsModule
                    ),
            },
            {
                path: "freelancer_requests",
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import("../designer_requests/designer_requests.module").then(
                        (m) => m.DesignerRequestsModule
                    ),
            },
            {
                path: "",
                redirectTo: "auth",
                pathMatch: "full",
            },

            {
                path: "**",
                redirectTo: "auth",
            },

        ]
    },
    {
        path: "auth",
        loadChildren: () =>
            import("../auth/auth.module").then((m) => m.AuthModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
