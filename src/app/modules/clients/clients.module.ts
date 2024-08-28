import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './clients-routing.module';
import { ClientListingComponent } from './clients-listing/client-listing.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UserService } from '@core/services/user/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientDetailsViewComponent } from './clients-details-view/client-details-view.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { environment } from 'environments/environment';

const config: SocketIoConfig = { url: environment.chatUrl, options: {path:'/api/socket.io'} };


@NgModule({
  declarations: [
        ClientListingComponent,
        ClientDetailsViewComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgxDatatableModule,
    SocketIoModule.forRoot(config),
    NgbModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [UserService]
})
export class ClientsModule { }
