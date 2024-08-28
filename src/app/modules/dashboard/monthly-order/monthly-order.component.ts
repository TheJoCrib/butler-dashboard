import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '@core/services/dashboard/dashboard.service';
import { colors } from '@core/utilities/colors.const';

@Component({
  selector: 'app-monthly-order',
  templateUrl: './monthly-order.component.html',
  styleUrls: ['./monthly-order.component.scss']
})
export class MonthlyOrderComponent implements OnInit {

  monthlyOrderData: any
  statisticsLine;
  data: any;
  isMenuToggled = false;

  @ViewChild('statisticsLineChartRef') statisticsLineChartRef: any;

  constructor(private dashboardService: DashboardService,) {
    this.statisticsLine = {
      chart: {
        height: 70,
        type: 'line',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      grid: {
        // show: true,
        //test push
        borderColor: "#EBEBEB",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
        padding: {
          top: -30,
          bottom: -10
        }
      },
      stroke: {
        width: 3
      },
      colors: [colors.solid.info],
      series: [
        {
          name: "January",
          data: [0, 20, 5, 30, 15, 45]
        }
      ],
      markers: {
        size: 2,
        colors: colors.solid.info,
        strokeColors: colors.solid.info,
        strokeWidth: 2,
        strokeOpacity: 1,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 5,
            fillColor: '#ffffff',
            strokeColor: colors.solid.info,
            size: 5
          }
        ],
        shape: 'circle',
        radius: 2,
        hover: {
          size: 3
        }
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontSize: '0px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      tooltip: {
        x: {
          show: false
        }
      }
    };
  }

  loader = false
  ngOnInit(): void {
    this.loader = true
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isMenuToggled = true;
      this.statisticsLine.chart.width = this.statisticsLineChartRef?.nativeElement.offsetWidth;
    }, 500);
  }
}
