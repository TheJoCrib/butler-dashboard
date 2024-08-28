import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {DesignerRequestsRoutingModule} from './designer_requests-routing.module';
import {CoreCommonModule} from '@core/common.module';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SWIPER_CONFIG, SwiperConfigInterface,} from 'ngx-swiper-wrapper';
import {FreelancersService} from '@core/services/freelancers/freelancers.service';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {environment} from 'environments/environment'
import {SocketService} from "../../../@core/services/chat/socket.service";
import {SwiperModule} from "swiper/angular";
import {RequestListingComponent} from "./request-listing/requests-listing.component";
import {RequestDetailsViewComponent} from "./request-details-view/request-details-view.component";

const config: SocketIoConfig = {url: environment.chatUrl, options: {path: '/api/socket.io'}};

// swiper configuration
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto'
};

@NgModule({
    declarations: [
        RequestListingComponent,
        RequestDetailsViewComponent,
    ],
    imports: [
        CommonModule,
        DesignerRequestsRoutingModule,
        CoreCommonModule,
        ContentHeaderModule,
        NgxDatatableModule,
        NgbModule,
        SwiperModule,
        SocketIoModule.forRoot(config),
        NgSelectModule,
        SwiperModule

    ],
    providers: [
        FreelancersService, SocketService,
        {
            provide: SWIPER_CONFIG,
            useValue: DEFAULT_SWIPER_CONFIG
        }]
})
export class DesignerRequestsModule {
}
