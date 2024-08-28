import {Component, OnInit, Renderer2, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FreelancerStatus} from "@core/models/common-models";
import Stepper from "bs-stepper";
import {ToastrService} from "ngx-toastr";
import {Location} from "@angular/common";
import {ColumnMode} from "@swimlane/ngx-datatable";
import {UserService} from "@core/services/user/user.service";
import {JobService} from "@core/services/jobs/job.service";
import {InvoiceService} from "@core/services/invoice/invoices.service";

@Component({
    selector: "app-client-details-view",
    templateUrl: "./client-details-view.component.html",
    styleUrls: ["./client-details-view.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ClientDetailsViewComponent implements OnInit {
    selectedUser: any;
    query = {};
    loading = false;
    totalJobs = 0;
    invoices = [];
    totalInvoices = 0;
    jobs = [];
    totalSpent = 0;
    clientId = "";
    pageSize = 2;
    columns = [];
    offset = 0;
    id = "";
    public ColumnMode = ColumnMode;
    public contentHeader: object;
    freelancerStatusForUpdate = "";
    commentsForFreelancerStatusUpdate = "";
    submited = false;
    loader = false;
    selectedImage = "";
    rotateDegree = 90;
    private verticalWizardStepper: Stepper;
    private bsStepper;
    updateUser={};
    constructor(
        private userService: UserService,
        private jobService: JobService,
        private modalService: NgbModal,
        private router: Router,
        private invoiceService: InvoiceService,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        public location: Location,
        private renderer: Renderer2
    ) {
    }

    ngOnInit(): void {
        this.selectedUser = {};
        this.clientId = this.route.snapshot.paramMap.get("id");
        this.query = {clientId: this.clientId, pageSize: this.pageSize};
        this.getJobs();
        this.getInvoices();
        this.userService.getUserById(this.clientId).subscribe((res: any) => {
            this.selectedUser = res;
        });
        this.verticalWizardStepper = new Stepper(
            document.querySelector("#stepper2"),
            {
                linear: false,
                animation: true,
            }
        );
        this.bsStepper = document.querySelectorAll(".bs-stepper");
        if (!this.selectedUser) {
            this.location.back();
        }
        // this.inItContentHeader();
    }

    backLink() {
        this.location.back();
    }



    viewInvoice(invoiceId: string) {
        this.router.navigate(["/admin/invoices/details-view", invoiceId]);
    }

    getJobs() {
        this.jobService.getJobs(this.query).subscribe((res: any) => {
            this.jobs = res.data;
            this.totalJobs = res.totalCount;
        });
    }

    toggleProfile(client: any) {
        client.isProfileVerified = !client.isProfileVerified;
        this.userService.update(client._id, {isProfileVerified: client.isProfileVerified}).subscribe((value: any) => {
            if (value && value.updatedUser)
                this.selectedUser = value.updatedUser;
        });
    }

    getInvoices() {
        this.invoiceService.getInvoices(this.query).subscribe((res: any) => {
            this.invoices = res.data;
            this.totalInvoices = res.totalCount;
        });
    }

    handleTabChange(flag) {
        this.offset = 0;
        console.log(this.pageSize, this.jobs, this.totalJobs);
        if (flag === "jobs") {
            this.getJobs();
        }
        if (flag === "invoices") {
            this.getInvoices();
        }
    }

    setPage(pageInfo, flag) {
        if (flag === "jobs") {
            this.offset = pageInfo.offset;
            this.query = {...this.query, pageNo: this.offset + 1};
            this.getJobs();
        }
        if (flag === "invoices") {
            this.offset = pageInfo.offset;
            this.query = {...this.query, pageNo: this.offset + 1};
            this.getInvoices();
        }
    }

    updateFreelancerStatus() {
        if (
            this.commentsForFreelancerStatusUpdate == "" ||
            this.freelancerStatusForUpdate === ""
        ) {
            this.submited = true;
            return;
        }
        this.submited = false;
        let requestData = {
            status: FreelancerStatus[this.freelancerStatusForUpdate],
            comments: this.commentsForFreelancerStatusUpdate,
        };
        this.loader = true;
    }
    updateClient() {
        this.updateUser['userId']=this.selectedUser._id;
        this.userService.updateClient(this.updateUser).subscribe(value => {
            console.log('res:', value)
            this.toastr.success(
                `User Updated Successfully`,
                "Updated",
                {
                    toastClass: "toast ngx-toastr",
                    closeButton: true,
                }
            );
        });
        console.log('updateClient: ', this.selectedUser)
    }
    changeHandler(event, key) {
        this.updateUser[key] = event.target.value;
        console.log('freelancer: ', this.updateUser)
    }
    resetCommentModal() {
        this.freelancerStatusForUpdate = "";
        this.commentsForFreelancerStatusUpdate = "";
        this.loader = false;
        this.modalService.dismissAll();
    }

    modalOpenForm(modalForm) {
        this.commentsForFreelancerStatusUpdate = "";
        this.submited = false;
        this.modalService.open(modalForm);
    }

    getImage(string) {
        var regex = /<img.*?src='(.*?)'/;
        var img = regex.exec(string)[1];
        return img;
    }

    verticalWizardNext() {
        this.verticalWizardStepper.next();
    }

    verticalWizardPrevious() {
        this.verticalWizardStepper.previous();
    }

    onSubmit() {
        alert("Submitted!!");
        return false;
    }

    openImageModal(modalSM, imgae) {
        this.selectedImage = imgae;
        this.modalService.open(modalSM, {
            centered: true,
            size: "lg",
        });
    }

    // Success
    toastrSuccess(msg) {
        this.toastr.success(msg, "Staus Updated!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
        });
    }

    // Error
    toastrError(msg) {
        this.toastr.error(msg, "Status Not Updated!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
        });
    }

    rotateTheImage() {
        if (this.rotateDegree == 360) {
            this.rotateDegree = 0;
        }
        this.rotateDegree = this.rotateDegree + 90;
        const image = document.getElementById("selected-image");
        this.renderer.setStyle(
            image,
            "transform",
            `rotate(${this.rotateDegree}deg)`
        );
    }
}
