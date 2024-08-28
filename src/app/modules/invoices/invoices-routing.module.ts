import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { InvoiceComponent } from "./invoice/invoice.component";
import { AuthGuard } from "@core/services/authentication/auth-guard.service";
import { PERMISSIONS } from "@core/utilities/constants";
import { ViewInvoiceComponent } from "./view-invoice/view-invoice.component";

const routes: Routes = [
  {
    path: "",
    component: InvoiceComponent,
    canActivate: [AuthGuard],
    data: { permission: PERMISSIONS.VIEW_INVOICE },
  },
  {
    path: "details-view/:id",
    canActivate: [AuthGuard],
    data: { permission: PERMISSIONS.VIEW_INVOICE },
    component: ViewInvoiceComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class InvoicesRoutingModule {}
