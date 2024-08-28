import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {CoreCommonModule} from '@core/common.module';
import {NgApexchartsModule} from 'ng-apexcharts';
import {
    FreelancersOnboardingOnsightComponent
} from './freelancers-onboarding-onsight/freelancers-onboarding-onsight.component';
import {MonthlyOrderComponent} from './monthly-order/monthly-order.component';
import {TopCustomersComponent} from './top-customers/top-customers.component';
import {OnlineFreelancersComponent} from './online-freelancers/online-freelancers.component';
import {RecentOrderComponent} from './recent-order/recent-order.component';
import {OrdersTrendComponent} from './orders-trend/orders-trend.component';
import {DashboardComponent} from './dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {CustomersOrderStatisticsComponent} from './customers-statistics/customers-order-statistics.component';
import {DashboardService} from '@core/services/dashboard/dashboard.service';
import {SkillTrendsComponent} from './skill-trends/skill-trends.component';
import {environment} from 'environments/environment';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";

const config: SocketIoConfig = {url: environment.chatUrl, options: {path: '/api/socket.io'}};


@NgModule({
    declarations: [
        DashboardComponent,
        FreelancersOnboardingOnsightComponent,
        MonthlyOrderComponent,
        TopCustomersComponent,
        OnlineFreelancersComponent,
        RecentOrderComponent,
        OrdersTrendComponent,
        CustomersOrderStatisticsComponent,
        SkillTrendsComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgbModule,
        SocketIoModule.forRoot(config),
        PerfectScrollbarModule,
        CoreCommonModule,
        NgApexchartsModule,
    ],
    providers: [DashboardService],
    exports: [DashboardComponent]
})
export class DashboardModule {
}
