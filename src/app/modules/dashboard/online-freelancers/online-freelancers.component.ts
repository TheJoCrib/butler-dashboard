import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { DashboardService } from "@core/services/dashboard/dashboard.service";
import { colors } from "@core/utilities/colors.const";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-online-freelancers",
  templateUrl: "./online-freelancers.component.html",
  styleUrls: ["./online-freelancers.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class OnlineFreelancersComponent implements OnInit {
  @Input("onlineFreelancersStats") onlineFreelancersStats: any;
  goalChartoptions;
  data: any;
  isMenuToggled = false;
  series: any;
  onApiDataChanged: BehaviorSubject<any>;
  @ViewChild("goalChartRef") goalChartRef: any;
  @ViewChild("statisticsLineChartRef") statisticsLineChartRef: any;

  constructor(private dashboardService: DashboardService) {
    this.onApiDataChanged = new BehaviorSubject([]);
    // Goal Overview  Chart
    this.goalChartoptions = {
      chart: {
        height: 245,
        type: "radialBar",
        sparkline: {
          enabled: true,
        },
        dropShadow: {
          enabled: true,
          blur: 3,
          left: 1,
          top: 1,
          opacity: 0.1,
        },
      },
      colors: ["#51e5a8"],
      plotOptions: {
        radialBar: {
          offsetY: -10,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: "77%",
          },
          track: {
            background: "#ebe9f1",
            strokeWidth: "50%",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              color: "#5e5873",
              fontSize: "2.86rem",
              fontWeight: "600",
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: [colors.solid.success],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: "round",
      },
      grid: {
        padding: {
          bottom: 30,
        },
      },
      // labels: ['Order Success']
    };
  }

  loader = false;
  ngOnInit(): void {
    console.log(this.onlineFreelancersStats);
  }

  // ngOnChanges() {
  //   this.series = [
  //     (this.onlineFreelancersStats?.online /
  //       this.onlineFreelancersStats?.totalCount) *
  //       100,
  //   ];
  // }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isMenuToggled = true;
      this.goalChartoptions.chart.width =
        this.goalChartRef?.nativeElement.offsetWidth;
    }, 500);
  }
}
