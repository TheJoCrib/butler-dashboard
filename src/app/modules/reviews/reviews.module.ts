import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReviewsRoutingModule} from './reviews-routing.module';
import {CoreCommonModule} from '@core/common.module';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SWIPER_CONFIG, SwiperConfigInterface,} from 'ngx-swiper-wrapper';
import {FreelancersService} from '@core/services/freelancers/freelancers.service';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {environment} from 'environments/environment';
import {ReviewsListingComponent} from './reviews-listing/reviews-listing.component';
import {SocketService} from "../../../@core/services/chat/socket.service";
import {SwiperModule} from "swiper/angular";
import {ReviewDetailsViewComponent} from "./reviews-details-view/review-details-view.component";

const config: SocketIoConfig = {url: environment.chatUrl, options: {path: '/api/socket.io'}};

// swiper configuration
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto'
};

@NgModule({
    declarations: [
        ReviewsListingComponent,
        ReviewDetailsViewComponent,
    ],
    imports: [
        CommonModule,
        ReviewsRoutingModule,
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
export class ReviewsModule {
}
