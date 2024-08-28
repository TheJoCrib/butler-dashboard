import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { InvoiceService } from '@core/services/invoice/invoices.service';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    ViewInvoiceComponent,
    InvoiceComponent,
    
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    InvoicesRoutingModule,
    ContentHeaderModule,
    CoreCommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule,
    NgxDaterangepickerMd.forRoot()
  ],
  providers: [InvoiceService]
})
export class InvoicesModule { }
