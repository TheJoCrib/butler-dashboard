import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {SocketService} from "@core/services/chat/socket.service";
import {UserService} from "@core/services/user/user.service";
import {ColumnMode, DatatableComponent} from "@swimlane/ngx-datatable";
import Swal from "sweetalert2";
import {FreelancersService} from "../../../../@core/services/freelancers/freelancers.service";
import {DialogService} from "../../../../@core/components/dialog.service";

@Component({
    selector: "app-client-listing",
    templateUrl: "./client-listing.component.html",
    styleUrls: ["./client-listing.component.scss"],
    encapsulation: ViewEncapsulation.None,
    providers: [SocketService],
})
export class ClientListingComponent implements OnInit {
    public contentHeader: object;
    breadcrumbTitle = "";
    public selected = [];
    public ColumnMode = ColumnMode;
    public expanded = {};
    public clients = [];
    public columns = [];
    public pageSize: number = 10;
    totalClient = 0;
    limit = 10;
    offset = 0;
    query = {};
    userStatusSub: any;
    onlineClients = [];
    @ViewChild("tableRowDetails") tableRowDetails: any;
    @ViewChild(DatatableComponent) table: DatatableComponent;
    searchBoxValue: FormControl = new FormControl();
    loading = false;
    loader = false;
    selectedClient: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private _FreelancersService: FreelancersService,
        private _dialogService: DialogService,
        private socketService: SocketService
    ) {
    }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.breadcrumbTitle = data.breadcrumbTitle;
            this.inItContentHeader();
        });
        this.socketService.connect();
        this.userStatusSub = this.socketService.updatedUserStatus().subscribe((res: any) => {
            this.onlineClients = res.users.activeClients;
            this.getClients();
        });
    }

    ngOnDestroy() {
        this.userStatusSub.unsubscribe();
        this.socketService.disconnect();
    }

    handlePageLimit() {
        this.offset = 0;
        this.query = {...this.query, pageSize: this.pageSize, pageNo: this.offset + 1};
        this.getClients();
    }

    getClients() {
        this.userService
            .getClients({...this.query, pageSize: this.pageSize})
            .subscribe((res: any) => {
                this.clients = res.data;
                this.clients = this.clients.map((c) => {
                    return {
                        ...c,
                        online: this.onlineClients.includes(c._id),
                    };
                });
                this.totalClient = res.totalCount;
            });
    }

    setPage(pageInfo) {
        this.offset = pageInfo.offset;
        this.query = {...this.query, pageNo: this.offset + 1};
        this.getClients();
    }

    searchClient() {
        this.query = {...this.query, q: this.searchBoxValue.value};
        this.getClients();
    }

    updateFreelancerStatus(status, btnText) {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#7367F0",
            cancelButtonColor: "#E42728",
            confirmButtonText: "Yes, " + btnText + " it!",
            customClass: {
                confirmButton: "btn btn-danger",
                cancelButton: "btn btn-primary ml-1",
            },
        }).then((result: any) => {
            if (result.value) {
                let requestData = {
                    client_id: this.selectedClient.client_id,
                    status: status,
                };
                this.loader = true;
            }
        });
    }

    inItContentHeader() {
        this._FreelancersService.setBreadcrumbTitle(this.breadcrumbTitle);
        this.contentHeader = {
            headerTitle: "Clients",
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

    toggleDetailsView(client: any) {
        this.router.navigate(["/admin/clients/details-view", client._id]);
    }

    toggleStatus(client: any) {
        const msg = 'Are you sure, you want to ' + (client.isBanned ? 'Ban' : 'unban') + ' the user?';
        this._dialogService.swalConfirmation(msg, 'warning', "Yes").then(value => {
            if (value && value.value)  {
                client.isBanned = !client.isBanned;

                this.userService
                    .update(client._id, {isBanned: client.isBanned})
                    .subscribe((res: any) => {
                    });
            }
        })

    }

    // toggleProfile(client: any) {
    //   client.isProfileVerified = !client.isProfileVerified;
    //   this.userService.update(client._id, client);
    // }
}
