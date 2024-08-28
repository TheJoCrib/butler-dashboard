import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../@core/services/authentication/auth-guard.service";
import { UnderMaintanceComponent } from "./layout/components/under-maintance/under-maintance.component";
import { SupportComponent } from "../../src/app/layout/components/support/support.component";

const routes: Routes = [
  {
    path: "admin",
    loadChildren: () =>
      import("./modules/admin/admin.module").then((m) => m.AdminModule),
  },

  {
    path: "",
    component: UnderMaintanceComponent,
  },
  {
    path: "support",
    component: SupportComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
