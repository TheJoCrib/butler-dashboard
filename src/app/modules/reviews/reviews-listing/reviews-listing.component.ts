import {Component, OnInit} from '@angular/core';
import {ColumnMode} from "@swimlane/ngx-datatable";
import {SocketService} from "../../../../@core/services/chat/socket.service";
import {ReviewsService} from "../../../../@core/services/reviews/reviews.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-reviews-listing',
    templateUrl: './reviews-listing.component.html',
    styleUrls: ['./reviews-listing.component.scss']
})
export class ReviewsListingComponent implements OnInit {

    public contentHeader: object;
    public pageSize: number = 10;
    loading = true;
    limit = 50;
    offset = 0;
    public ColumnMode = ColumnMode;
    query = {};
    userStatusSub: any;
    reviews = [];
    itemSource = [];

    constructor(
        private socketService: SocketService,
        private reviewService: ReviewsService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.socketService.connect();
        this.userStatusSub = this.socketService
            .updatedUserStatus()
            .subscribe((res: any) => {
                this.getReviews();
            });
    }

    ngOnDestroy() {
        this.userStatusSub.unsubscribe();
        this.socketService.disconnect();
    }


    /**
     *  Get All Reviews and preparing itemsource
     */
    getReviews() {
        this.reviewService.getAllReviews().subscribe((res: any) => {
            this.reviews = res;
            this.getItemSource(res);
            console.log(this.itemSource)
            this.loading = false;
        });
    }

    getItemSource(res) {
        this.itemSource = res.map(item => ({
            clientName: item.client && item.client[0] ? item.client[0].fullName : 'N/A',
            designerName: item.designer && item.designer[0] ? item.designer[0].fullName : 'N/A',
            jobTitle: item.jobDetails && item.jobDetails[0] ? item.jobDetails[0].title : 'N/A',
            comment: item.comment || 'No comment available',
            id: item._id ,
        }));
    }

    /**
     *  Search Function
     * @param e
     */

    searchReviews(e: any) {
        console.log('e:: ', e.target.value);
        const searchTerm = e.target.value;
        if (searchTerm) {
            this.itemSource = this.reviews.filter((item: any) =>
                Object.values(item).some((value: any) => value.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        } else {
            this.itemSource = this.reviews;
        }
    }

    /**
     *  Pagination Handling
     * @param pageInfo
     */
    setPage(pageInfo) {
        this.loading = true;
        this.offset = pageInfo.offset;
        this.query = {...this.query, pageNo: this.offset + 1};
        this.getReviews();
    }

    handlePageLimit() {
        this.query = {...this.query, pageSize: this.pageSize};
        this.getReviews();
    }
    navigateToDetailsView(row) {
        console.log('rrow::',row)
        console.log('reviews::',this.reviews)
        const item = this.reviews.find(value => value._id === row.id);
        this.router.navigateByUrl(`/admin/reviews/details-view/${item._id}`);
    }
}
