import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '@core/services/dashboard/dashboard.service';
import { JobService } from '@core/services/jobs/job.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-recent-order',
  templateUrl: './recent-order.component.html',
  styleUrls: ['./recent-order.component.scss']
})
export class RecentOrderComponent implements OnInit {

  constructor(private jobService: JobService,) { }
  recentOrder: any
  vehiclesIconsBaseUrl = environment.vehiclesIconsBaseUrl

  loader = false
  ngOnInit(): void {
    this.jobService.getJobs({order:'desc'}).subscribe((res:any)=>{
      this.recentOrder = res.data
    })
    // this.loader = true
    // this.dashboardService.getRecentOrder().then(response => {
    //   this.recentOrder = response
    //   this.loader = false
    // }, error => {
    //   this.loader = false
    // }
    // );
  }
}
