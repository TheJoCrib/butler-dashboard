import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FreelancersRoutingModule } from './freelancers-routing.module';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { FreelancerDetailsViewComponent } from './freelancer-details-view/freelancer-details-view.component';
import { FreelancersListingComponent } from './freelancers-listing/freelancers-listing.component';
import { FreelancersService } from '@core/services/freelancers/freelancers.service';
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { environment } from 'environments/environment';
const config: SocketIoConfig = { url: environment.chatUrl, options: {path:'/api/socket.io'} };

// swiper configuration
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};
@NgModule({
  declarations: [
    FreelancersListingComponent,
    FreelancerDetailsViewComponent,
  ],
  imports: [
    CommonModule,
    FreelancersRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgxDatatableModule,
    NgbModule,
    SwiperModule,
    SocketIoModule.forRoot(config),
    NgSelectModule

  ],
  providers: [
    FreelancersService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }]
})
export class FreelancersModule { }
