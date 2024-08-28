import {Component, OnInit} from '@angular/core';
import {ColumnMode} from "@swimlane/ngx-datatable";
import {SocketService} from "../../../../@core/services/chat/socket.service";
import {FreelancerRequestsService} from "../../../../@core/services/freelancerRequests/freelancer_requests.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-requests-listing',
    templateUrl: './requests-listing.component.html',
    styleUrls: ['./requests-listing.component.scss']
})
export class RequestListingComponent implements OnInit {

    public contentHeader: object;
    public pageSize: number = 10;
    loading = true;
    limit = 50;
    offset = 0;
    public ColumnMode = ColumnMode;
    query = {};
    userStatusSub: any;
    requests = [];
    itemSource = [];

    constructor(
        private socketService: SocketService,
        private requestsService: FreelancerRequestsService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.socketService.connect();
        this.userStatusSub = this.socketService
            .updatedUserStatus()
            .subscribe((res: any) => {
                this.getRequests();
            });
    }

    ngOnDestroy() {
        this.userStatusSub.unsubscribe();
        this.socketService.disconnect();
    }


    /**
     *  Get All Reviews and preparing itemsource
     */
    getRequests() {
        this.requestsService.getAllRequests().subscribe((res: any) => {
            console.log('res:::', res)
            this.requests=res.requests;
            this.getItemSource(res.requests);
            console.log(this.itemSource)
            this.loading = false;
        });
    }

    getItemSource(res) {
        this.itemSource = res?.map(item => ({
            designerName: item.designer && item.designer[0] ? item.designer[0].fullName : 'N/A',
            status: item.status || 'N/A',
            phone: item.designer && item.designer[0] ? item.designer[0].phone : 'N/A',
            id: item._id,
            aboutMe: item.designer && item.designer[0] ? item.designer[0].aboutMe : 'N/A',
        }));
        // this.itemSource = this.requests;
    }


    /**
     *  Search Function
     * @param e
     */

    searchRequests(e: any) {
        console.log('e:: ', e.target.value);
        const searchTerm = e.target.value;
        if (searchTerm) {
            this.itemSource = this.requests.filter((item: any) =>
                Object.values(item).some((value: any) => value.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        } else {
            this.itemSource = this.requests;
        }
    }

    navigateToDetailsView(row) {
        const item = this.requests.find(value => value._id === row.id);
        this.router.navigateByUrl(`/admin/freelancer_requests/details-view/${item._id}`);
    }

    /**
     *  Pagination Handling
     * @param pageInfo
     */
    setPage(pageInfo) {
        this.loading = true;
        this.offset = pageInfo.offset;
        this.query = {...this.query, pageNo: this.offset + 1};
        this.getRequests();
    }

    handlePageLimit() {
        this.query = {...this.query, pageSize: this.pageSize};
        this.getRequests();
    }

}
