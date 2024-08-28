import {Component, OnInit, ViewEncapsulation,} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import Stepper from "bs-stepper";
import {Location} from "@angular/common";
import {ColumnMode,} from "@swimlane/ngx-datatable";
import {ReviewsService} from "../../../../@core/services/reviews/reviews.service";

@Component({
    selector: "app-review-details-view",
    templateUrl: "./review-details-view.component.html",
    styleUrls: ["./review-details-view.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ReviewDetailsViewComponent implements OnInit {
    public loading: boolean;
    client: any;
    reviewID: string;
    query = {};
    public ColumnMode = ColumnMode;
    payments: any;
    public contentHeader: object;
    categories = [];
    selectedReview:any;
    reviews = [];
    private verticalWizardStepper: Stepper;

    constructor(
        private route: ActivatedRoute,
        public location: Location,
        private reviewsService: ReviewsService,
    ) {
    }

    ngOnInit(): void {
        this.reviewID = this.route.snapshot.paramMap.get("id");
        this.getReviews();
        this.verticalWizardStepper = new Stepper(
            document.querySelector("#stepper2"),
            {
                linear: false,
                animation: true,
            }
        );
    }


    getReviews() {
        this.reviewsService.getAllReviews().subscribe((res: any) => {
            this.reviews = res;
            this.selectedReview = this.reviews.find(value => value._id === this.reviewID);
            console.log('selectedReview',this.selectedReview)
            this.client = (this.selectedReview as any).client[0];
            this.loading = false;
        });
    }

    // BACK TO LISTING BUTTON
    backLink() {
        this.location.back();
    }

}
