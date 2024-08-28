import {Component, OnInit, Renderer2, ViewEncapsulation,} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Stepper from "bs-stepper";
import {ToastrService} from "ngx-toastr";
import {Location} from "@angular/common";
import {ColumnMode,} from "@swimlane/ngx-datatable";
import {UserService} from "@core/services/user/user.service";
import {JobService} from "@core/services/jobs/job.service";
import {CategoryService} from "@core/services/category/category.service";
import {PaymentService} from "@core/services/payment/payment.servcie";
import {FreelancerRequestsService} from "../../../../@core/services/freelancerRequests/freelancer_requests.service";

@Component({
    selector: "app-request-details-view",
    templateUrl: "./request-details-view.component.html",
    styleUrls: ["./request-details-view.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class RequestDetailsViewComponent implements OnInit {
    public loading: boolean;
    // FREELANCER VARIABLES
    freelancer: any;
    requestID: string;
    freelancerSkills: any;
    freelancerPortfolio: any;
    // FREELANCER DATATABLE VARIABLES
    limit = 50;
    // freelancerRating: any;
    offset = 0;
    // FREELANCER JOBS DATATABLE VARIABLES
    pageSize: number = 10;
    query = {};
    jobs: any;
    totalJobs: any;
    totalEarned: number = 0;
    // public basicSelectedOption: number = 50;
    public ColumnMode = ColumnMode;
    usersQuery = {skills: ""};
    payments: any;
    totalPayments: any;
    public contentHeader: object;
    categories = [];
    skillPresent: any;
    selectedCategory: any;
    showUpdateButton = false;
    categoriesId = [];
    selectedImage = "";
    rotateDegree = 90;
    selectedRequest:any;
    updateUser = {};
    requests = [];
    private verticalWizardStepper: Stepper;
    private bsStepper;

    constructor(
        private categoryService: CategoryService,
        private route: ActivatedRoute,
        private paymentService: PaymentService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        public location: Location,
        private renderer: Renderer2,
        private userService: UserService,
        private requestsService: FreelancerRequestsService,
        private jobService: JobService
    ) {
    }

    // GET http://localhost:4200/null 404 (Not Found)
    ngOnInit(): void {
        // feather.replace();
        this.requestID = this.route.snapshot.paramMap.get("id");

        this.getRequests();

        this.verticalWizardStepper = new Stepper(
            document.querySelector("#stepper2"),
            {
                linear: false,
                animation: true,
            }
        );
    }


    getRequests() {
        this.requestsService.getAllRequests().subscribe((res: any) => {
            console.log('res:::', res)
            this.requests = res.requests;
            this.selectedRequest = this.requests.find(value => value._id === this.requestID);
            this.freelancer = (this.selectedRequest as any).designer[0];
            console.log('selectedRequest:: ', this.selectedRequest)
            this.loading = false;
        });
    }

    rejectRequest() {
        const requestID= this.selectedRequest._id;
        this.requestsService.rejectRequest(requestID).subscribe((res: any) => {
            this.promptMessage(res.message)
            console.log('rejectRequest:',res)
        });
    }

    approveRequest() {
        const requestID= this.selectedRequest._id;
        this.requestsService.approveRequest(requestID).subscribe((res: any) => {
            this.promptMessage(res.message)
            console.log('Approve:',res)
        });
    }

    promptMessage(message){
        this.toastr.success(
            message,
            "Success",
            {
                toastClass: "toast ngx-toastr",
                closeButton: true,
            }
        );
        setTimeout(()=>{
            this.backLink();
        },500);
    }

    // BACK TO LISTING BUTTON
    backLink() {
        this.location.back();
    }


}
