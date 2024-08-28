import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DashboardService} from '@core/services/dashboard/dashboard.service';
import {JobService} from '@core/services/jobs/job.service';
import {UserService} from '@core/services/user/user.service';

@Component({
    selector: 'app-customers-order-statistics',
    templateUrl: './customers-order-statistics.component.html',
    styleUrls: ['./customers-order-statistics.component.scss']
})
export class CustomersOrderStatisticsComponent implements OnInit {
    @Input() indicator = '';
    statistics: any
    query = {};
    loader = true
    profits: any;

    constructor(private dashboardService: DashboardService, private router: Router, private userService: UserService, private jobService: JobService,) {
    }

    ngOnInit(): void {
        this.getFreelancers()
        this.getClients()
        this.getJobs()
        this.getProfits()
        this.statistics = {
            freelancers_income: 0,
            customers: 0,
            clients: 0,
            orders: 0
        }
        console.log('profits: ',this.profits)
    }

    getFreelancers() {
        this.userService.getFreelancers(this.query).subscribe((res: any) => {
            this.statistics.designers = res.totalCount;
            this.loader = false
        });
    }

    getClients() {
        this.userService.getClients(this.query).subscribe((res: any) => {
            this.statistics.clients = res.totalCount;
            this.loader = false
        });
    }

    getJobs() {
        this.jobService
            .getJobs({...this.query})
            .subscribe((res: any) => {
                this.statistics.orders = res.totalCount;
                this.statistics.freelancers_income = res.data?.reduce((a: any, b: any) => {
                    return a + b.price;
                }, 0);
                this.loader = false
            });
    }


    getProfits() {
        this.userService
            .getProfits({})
            .subscribe((res: any) => {
                console.log('res::', res);
                this.profits =res;
                this.loader = false
            });
    }

    navigateTo(path: string) {
        // this.router.navigateByUrl(path)
    }
}
