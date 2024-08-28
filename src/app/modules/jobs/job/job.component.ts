import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "environments/environment";
import { FreelancersService } from "../../../../@core/services/freelancers/freelancers.service";
import { JobService } from "@core/services/jobs/job.service";
import _ from "lodash";
import { AuthGuard } from "@core/services/authentication/auth-guard.service";
import { PERMISSIONS } from "@core/utilities/constants";

@Component({
  selector: "app-job",
  templateUrl: "./job.component.html",
  styleUrls: ["./job.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class JobComponent implements OnInit {
  vehiclesIconsBaseUrl = environment.vehiclesIconsBaseUrl;
  loading = false;
  confPerm = PERMISSIONS;
  searchBoxValue = "";
  public contentHeader: object;
  jobStatus = "active";
  breadcrumbTitle = "";
  query = {};
  public pageSize: number = 10;
  columns = [];
  public kitchenSinkRows: any;
  public selected = [];
  public ColumnMode = ColumnMode;
  public expanded = {};
  public jobs: any;
  totalJobs = 0;
  limit = 10;
  offset = 0;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _FreelancersService: FreelancersService,
    private jobService: JobService,
    private authGuardService: AuthGuard
  ) {}

  getJobs() {
    this.loading = true;
    this.jobService
      .getJobs({ ...this.query, pageSize: this.pageSize, order: "desc" })
      .subscribe((res: any) => {
        this.jobs = res.data;
        this.totalJobs = res.totalCount;
        this.loading = false;
      });
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.jobStatus = data.jobStatus;
      this.breadcrumbTitle = data.breadcrumbTitle;
      this.inItContentHeader();
    });
    this.getJobs();
  }
  checkPermission(permission) {
    return this.authGuardService.checkPermisison(permission);
  }
  changePageSize() {
    this.offset = 0;
    this.query = { ...this.query, pageNo: 1 };
    this.query = { ...this.query, pageSize: this.pageSize };
    this.getJobs();
  }
  setPage(pageInfo) {
    this.offset = pageInfo.offset;
    this.query = { ...this.query, pageNo: this.offset + 1 };
    this.getJobs();
  }

  loader = false;
  inItContentHeader() {
    this._FreelancersService.setBreadcrumbTitle(this.breadcrumbTitle);
    this.contentHeader = {
      headerTitle: "Jobs",
      actionButton: false,
      breadcrumb: {
        type: "",
        links: [
          {
            name: this.breadcrumbTitle,
            isLink: false,
          },
        ],
      },
    };
  }
  toggleEditView(job) {
    this.router.navigate(["/admin/jobs/details-view", job._id]);
  }

  selectedFreelancer: any;
  createJobBy: any;
  createJob() {
    this.router.navigate(["/admin/jobs/create"]);
  }
  navigateToDetailsView(freelancer: any) {
    this.selectedFreelancer = freelancer;
    this._FreelancersService.setSelectedFreelancer(this.selectedFreelancer);
    this.router.navigateByUrl("/adminjobs/details-view");
  }
  searchJobs(e: any) {
    this.query = { ...this.query, q: e.target.value };
    _.debounce(() => {
      this.getJobs();
    }, 500)();
  }
}
