import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DashboardService} from '@core/services/dashboard/dashboard.service';
import {JobService} from "../../../../@core/services/jobs/job.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-skill-trends',
    templateUrl: './skill-trends.component.html',
    styleUrls: ['./skill-trends.component.scss']
})
export class SkillTrendsComponent implements OnInit, AfterViewInit {
    isMenuToggled = false
    data: any;
    itemSource: any;
    jobs: any;
    subscription: Subscription = new Subscription();
    loader = false

    constructor(private dashboardService: DashboardService, private jobsService: JobService) {


    }

    ngOnInit(): void {

        this.getAllJobs()


    }

    ngAfterViewInit() {

    }

    getAllJobs() {
        this.jobsService
            .getAllJobs({pageSize:100})
            .subscribe((res: any) => {
                this.jobs = res.data;
                if (this.jobs.length > 0) {
                    this.jobHandler(this.jobs);
                }
                this.loader = false
            });
    }

    filtrationHandler(event) {
        const selectedValue = event.target.value;
        switch (selectedValue) {
            case 'S':
                this.filterItemsByDateRange(this.jobs, 7)
                break;
            case 'F':
                this.filterItemsByDateRange(this.jobs, 14)
                break;
            case 'T':
                this.filterItemsByDateRange(this.jobs, 30)
                break;
            case 'X':
                this.jobHandler(this.jobs);
                break;

        }
    }

    filterItemsByDateRange(items: any[], dateRangeInDays: number): void {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - dateRangeInDays);

        const results: any = items.filter((item) => {
            const itemDate = new Date(item.createdAt); // Assuming createdAt is a valid date string
            return itemDate >= startDate && itemDate <= today;
        });
        this.jobHandler(results);
    }

    jobHandler(jobs$: any) {
        console.log('jobs:::',jobs$)
        if (Array.isArray(jobs$)) {
            const categoryCounts = {};
            jobs$.forEach((job: any) => {
                const category = job.category.name;
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });

            const totalCount: any = Object.values(categoryCounts).reduce(
                (total: any, count) => total + count,
                0
            );

            const categoryData = Object.keys(categoryCounts).map((category) => ({
                count: categoryCounts[category],
                name: category,
                percentage: ((categoryCounts[category] / totalCount) * 100).toFixed(2) + "%",
            }));
            this.itemSource = categoryData;
        } else {
            console.log('Invalid data format. Expected an array of job objects.');
        }
    }

}
