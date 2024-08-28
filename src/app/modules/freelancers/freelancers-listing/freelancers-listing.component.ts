import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {Router} from "@angular/router";
import {SocketService} from "@core/services/chat/socket.service";
import {UserService} from "@core/services/user/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ColumnMode, DatatableComponent,} from "@swimlane/ngx-datatable";
import _ from "lodash";
import {DialogService} from "../../../../@core/components/dialog.service";

@Component({
    selector: "app-freelancers-listing",
    templateUrl: "./freelancers-listing.component.html",
    styleUrls: ["./freelancers-listing.component.scss"],
    encapsulation: ViewEncapsulation.None,
    providers: [SocketService],
})
export class FreelancersListingComponent implements OnInit {
    // private tempData = [];
    // public kitchenSinkRows: any;
    // public selected = [];
    // public expanded = {};
    // public rows: any;

    public contentHeader: object;
    // In Use
    public pageSize: number = 10;
    loading = true;
    limit = 50;
    offset = 0;
    public ColumnMode = ColumnMode;
    freelancersCount: number;
    freelancers = [];
    onlineFreelancers = [];
    query = {};
    usersQuery = {jobCount: true, q: "", skills: ""};
    userStatusSub: any;
    @ViewChild("tableRowDetails") tableRowDetails: any;
    @ViewChild(DatatableComponent) table: DatatableComponent;
    freelancerStatus = "default";

    constructor(
        private router: Router,
        private socketService: SocketService,
        private userService: UserService,
        private _dialogService: DialogService,
        private modalService: NgbModal
    ) {
        // this.rows = this.freelancersList;
        // this.totalFreelancer = this.freelancersList.length;
    }

    // breadcrumbTitle = "Registration Requests";
    ngOnInit(): void {
        // this.route.data.subscribe((data) => {
        //   this.breadcrumbTitle = data.breadcrumbTitle;
        //   this.inItContentHeader();
        // });
        this.socketService.connect();
        this.userStatusSub = this.socketService
            .updatedUserStatus()
            .subscribe((res: any) => {
                console.log(res.users);
                this.onlineFreelancers = res.users.activeFreelancers;
                this.getFreelancers();
            });
    }

    ngOnDestroy() {
        this.userStatusSub.unsubscribe();
        this.socketService.disconnect();
    }

    // Show Certain number of Freelancers
    handlePageLimit() {
        this.query = {...this.query, pageSize: this.pageSize};
        this.getFreelancers();
    }

    freelancerFilter() {
        switch (this.freelancerStatus) {
            case "Verified":
                this.query = {isProfileVerified: true};
                break;
            case "Unverified":
                this.query = {isProfileVerified: false};
                break;
            case "Banned":
                this.query = {isBanned: true};
                break;
            case "Unbanned":
                this.query = {isBanned: false};
                break;
            default:
                this.query = {};
        }
        this.getFreelancers();
    }

    // View Details of Freelancer
    navigateToDetailsView(freelancer: any) {
        this.router.navigateByUrl(`/admin/freelancers/details-view/${freelancer._id}`);
    }

    onSearchClients(searchText: any) {
        this.usersQuery = {...this.usersQuery, q: searchText};
    }

    // Getting All Freelancers
    getFreelancers() {
        this.userService.getFreelancers(this.query).subscribe((res: any) => {
            this.freelancers = res.data;
            this.freelancers = this.freelancers.map((f) => {
                return {
                    ...f,
                    online: this.onlineFreelancers.includes(f._id),
                };
            });
            console.log(this.freelancers)
            this.freelancersCount = res.totalCount;
            this.loading = false;
        });
    }

    // ban or un-ban Freelancer Profile
    toggleStatus(freelancer: any) {
        const msg = 'Are you sure, you want to ' + (freelancer.isBanned ? 'Disapprove' : 'Approved') + ' the designer?';
        this._dialogService.swalConfirmation(msg, 'warning', "Yes").then(value => {
            if (value && value.value) {
                freelancer.isBanned = !freelancer.isBanned;
                this.userService
                    .update(freelancer._id, {isBanned: freelancer.isBanned})
                    .subscribe((res: any) => {

                    });
            }
        });
    }

    searchFreelancers(e: any) {
        this.query = {...this.query, q: e.target.value};
        _.debounce(() => {
            this.getFreelancers();
        }, 500)();
    }

    setPage(pageInfo) {
        this.loading = true;
        this.offset = pageInfo.offset;
        this.query = {...this.query, pageNo: this.offset + 1};
        this.getFreelancers();
    }

    // inItContentHeader() {
    //   this._FreelancersService.setBreadcrumbTitle(this.breadcrumbTitle);
    //   this.contentHeader = {
    //     headerTitle: "Freelancers",
    //     actionButton: false,
    //     breadcrumb: {
    //       type: "",
    //       links: [
    //         {
    //           name: this.breadcrumbTitle,
    //           isLink: false,
    //         },
    //       ],
    //     },
    //   };
    // }

    getImage(string) {
        var regex = /<img.*?src='(.*?)'/;
        var img = regex.exec(string)[1];
        return img;
    }

    // modal Open Small
    modalOpenSM(modalSM) {
        this.modalService.open(modalSM, {
            centered: true,
            size: "lg", // size: 'xs' | 'sm' | 'lg' | 'xl'
        });
    }

    // filterUpdate(event) {
    //   const val = event.target.value.toLowerCase();

    //   // filter our data
    //   const temp = this.tempData.filter(function (data) {
    //     let text =
    //       data.freelancer_id +
    //       "-" +
    //       data.full_name +
    //       "-" +
    //       data.primary_phone +
    //       data.city_preference +
    //       "-" +
    //       data.vehicle_type;
    //     return text.toLowerCase().indexOf(val) !== -1 || !val;
    //   });

    //   // update the rows
    //   this.rows = temp;
    //   // Whenever the filter changes, always go back to the first page
    //   this.table.offset = 0;
    // }

    // selectedFreelancer: any;
}
