import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '@core/services/dashboard/dashboard.service';
import { colors } from '@core/utilities/colors.const';

@Component({
  selector: 'app-orders-trend',
  templateUrl: './orders-trend.component.html',
  styleUrls: ['./orders-trend.component.scss']
})
export class OrdersTrendComponent implements OnInit {
  @ViewChild('orderTrendsChartRef') orderTrendsChartRef: any;
  orderTrendsChartoptions;
  isMenuToggled = false
  data: any;
  constructor(private dashboardService: DashboardService) {
    // Revenue Report Chart
    this.orderTrendsChartoptions = {
      chart: {
        height: 230,
        stacked: true,
        type: 'bar',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          columnWidth: '17%',
          endingShape: 'rounded'
        }
      },
      colors: [colors.solid.primary, colors.solid.warning],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        padding: {
          top: -20,
          bottom: -10
        },
        yaxis: {
          lines: { show: false }
        }
      },
      xaxis: {
        categories: this.setMonth(),//['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '0.86rem'
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '0.86rem'
          }
        }
      },
      orderTrends: {
        OnlineOfflineTrends: {
          series: [{
            name: 'Online',
            data: [23, 45, 21, 25, 67, 98, 12, 54, 32, 68, 75, 12]
          },
          {
            name: 'Offline',
            data: [42, 48, 66, 78, 98, 23, 34, 45, 76, 32, 12, 57]
          }]
        },
        analyticsData: {
          currentBudget: '$25,852',
          totalBudget: '56,800'
        }
      },
    };
  }



  loader = false
  orderTrendsData: any
  ngOnInit(): void {
    // this.loader = true
    // this.dashboardService.getOrderTrends().then(response => {
    //   this.loader = false
    //   this.orderTrendsChartoptions.orderTrends.OnlineOfflineTrends.series = response
    //   // console.log("order Trends Data-->", response)
    // }, err => {
    //   this.loader = false
    // });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isMenuToggled = true;
      this.orderTrendsChartoptions.chart.width = this.orderTrendsChartRef?.nativeElement.offsetWidth;
    }, 500);

  }

  setMonth() {
    let date = new Date();
    let months = []
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (var i = 0; i < 12; i++) {
      months.push(monthNames[date.getMonth()]);
      date.setDate(1);
      date.setMonth(date.getMonth() - 1);
    }

    return months
  }

}
