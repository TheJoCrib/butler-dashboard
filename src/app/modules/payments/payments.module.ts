import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { PaymentListingComponent } from "./payment-listing/payment-listing.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

// routing
const routes: Routes = [
  {
    path: "",
    component: PaymentListingComponent,
  },
];
@NgModule({
  declarations: [PaymentListingComponent],
  imports: [
    NgxDatatableModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forChild(routes),
    ContentHeaderModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PaymentsModule {}
