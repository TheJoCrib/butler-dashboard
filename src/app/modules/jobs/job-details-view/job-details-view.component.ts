import {Component, OnInit, Renderer2, ViewChild, ViewEncapsulation,} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FreelancerStatus} from "@core/models/common-models";
import Stepper from "bs-stepper";
import {ToastrService} from "ngx-toastr";
import {Location} from "@angular/common";
import {ColumnMode} from "@swimlane/ngx-datatable";
import {JobService} from "@core/services/jobs/job.service";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "@core/services/user/user.service";
import {CategoryService} from "@core/services/category/category.service";
import {ACCEPTED, ALLOWED_EX, APPROVED, CLOSED, IN_PROGRESS, PENDING, SUBMITTED,} from "@core/utilities/constants";
import {DomSanitizer} from "@angular/platform-browser";
import {InvoiceService} from "@core/services/invoice/invoices.service";

@Component({
    selector: "app-job-details-view",
    templateUrl: "./job-details-view.component.html",
    styleUrls: ["./job-details-view.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class JobDetailsViewComponent implements OnInit {
    @ViewChild("fileInput", {static: false}) fileInput: any;
    public ColumnMode = ColumnMode;
    usersQuery = {jobCount: true, q: "", skills: ""};
    jobsQuery: {};
    pageSize = 2;
    dropdownSettings: IDropdownSettings = {};
    categoryDropdownSettings: IDropdownSettings = {};
    dropdownFreelancerSettings: IDropdownSettings = {};
    selectedCategory = "";
    editJobForm: FormGroup;
    submitted = false;
    freelancers = [];
    selectedFiles = [];
    job: any = {};
    clients = [];
    todayDate = new Date().toISOString().split("T")[0];
    selectedClient = [];
    selectedFreelancer = [];
    selectedStat = [];
    statusList = [
        {id: PENDING, name: PENDING},
        {id: IN_PROGRESS, name: IN_PROGRESS},
        {id: SUBMITTED, name: SUBMITTED},
        {id: APPROVED, name: APPROVED},
        {id: CLOSED, name: CLOSED},
        {id: ACCEPTED, name: ACCEPTED},
    ];
    categories: any;
    invoiceQuery: any = {pageSize: this.pageSize};
    offset = 0;
    public contentHeader: object;
    totalInvoices = 0;
    invoices = [];
    actualCategories = [];
    backLink = "/jobs";
    freelancerStatusForUpdate = "";
    commentsForFreelancerStatusUpdate = "";
    submited = false;
    loader = false;
    private verticalWizardStepper: Stepper;
    private bsStepper;

    constructor(
        private sanitizer: DomSanitizer,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        public location: Location,
        private userService: UserService,
        private categoryService: CategoryService,
        private invoiceService: InvoiceService,
        private renderer: Renderer2,
        private formBuilder: FormBuilder,
        private jobService: JobService,
        private route: ActivatedRoute
    ) {
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.editJobForm.controls;
    }

    get details(): FormArray {
        return this.editJobForm.get('details') as FormArray;
    }

    ngOnInit(): void {
        this.verticalWizardStepper = new Stepper(
            document.querySelector("#stepper2"),
            {
                linear: false,
                animation: true,
            }
        );
        this.dropdownFreelancerSettings = {
            singleSelection: true,
            idField: "id",
            textField: "displayName",
            itemsShowLimit: 5,
            allowRemoteDataSearch: true,
            allowSearchFilter: true,
        };
        this.dropdownSettings = {
            singleSelection: true,
            idField: "id",
            textField: "name",
            itemsShowLimit: 5,
            allowRemoteDataSearch: true,
            allowSearchFilter: true,
        };
        this.bsStepper = document.querySelectorAll(".bs-stepper");
        this.inItContentHeader();
        this.getClients();
        this.getFreelancers();
        this.getCategories();
        const jobId = this.route.snapshot.paramMap.get("id");
        this.initForm();
        this.jobService.getJobById(jobId).subscribe((res: any) => {
            this.initForm(res);
            this.getInvoices();
            this.changeCat("default");
        });
    }

    getInvoices() {
        if (this.job._id) {
            this.invoiceService
                .getInvoices({...this.invoiceQuery, jobId: this.job._id})
                .subscribe((res: any) => {
                    this.invoices = res.data;
                    this.totalInvoices = res.totalCount;
                });
        }
    }

    setPage(pageInfo, flag) {
        if (flag === "invoices") {
            this.offset = pageInfo.offset;
            this.invoiceQuery = {...this.invoiceQuery, pageNo: this.offset + 1};
            this.getInvoices();
        }
    }

    onSearchClients(searchText: any) {
        this.usersQuery = {...this.usersQuery, q: searchText};
    }

    onSearchFreelancers(searchText: any) {
        this.usersQuery = {...this.usersQuery, q: searchText};
    }

    getClients() {
        this.userService.getClients(this.usersQuery).subscribe((res: any) => {
            this.clients = res.data.map((c) => {
                return {id: c._id, name: c.fullName, email: c.email};
            });
        });
    }

    getCategories() {
        this.categoryService.getCategories().subscribe((res: any) => {
            // 'actualCategories' would also contain main/parent skills,
            // whereas  'categories' dont have parent skills
            this.actualCategories = res.categories.map((c) => {
                return {id: c._id, name: c.name, path: c.path};
            });
            this.categories = res.categories.map((c) => {
                return {id: c._id, name: c.name, path: c.path?.replaceAll(",", "")};
            });
            this.categories = this.categories.filter((item) => {
                return item.path !== undefined;
            });
            // for (let index = 0; index < this.categories.length; index++) {
            //   let parent = this.categories.findIndex(
            //     (ae) => ae.name === this.categories[index].path
            //   );
            //   if (parent > -1) {
            //     this.categories.splice(parent, 1);
            //   }
            // }
        });
        // this.categoryService.getCategories().subscribe((res: any) => {
        //   this.categories = res.categories.map((c) => {
        //     return { id: c._id, name: c.name, path: c.path };
        //   });
        // });
    }

    getThumbnail(file: any) {
        let ext = file.name.split(".").pop();
        switch (ext.toLowerCase()) {
            case "pdf":
                return "/assets/pdf-thumbnail.png";
            case "jpeg":
                return "/assets/picture.jpg";
            case "png":
                return "/assets/picture.jpg";
            case "docx":
                return "/assets/docx-thumbnail.png";
            case "mp4":
                return "/assets/video-thumbnail.png";
            default:
                return "/assets/simple.png";
        }
    }

    changeCat(action?: String) {
        this.usersQuery = {
            ...this.usersQuery,
            skills: this.selectedCategory,
        };
        this.getFreelancers();
        this.selectedFreelancer =
            action === "default" ? this.selectedFreelancer : [];
    }

    getFreelancers() {
        this.userService.getFreelancers(this.usersQuery).subscribe((res: any) => {
            this.freelancers = res.data.map((c) => {
                return {
                    id: c._id,
                    displayName: `${c.fullName}(${c.assignedJobs})`,
                    name: c.fullName,
                    email: c.email,
                };
            });
        });
    }

    viewInvoice(invoiceId: string) {
        this.router.navigate(["/admin/invoices/details-view", invoiceId]);
    }

    getSanitizedURL(url) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    createDetail(des?): FormGroup {
        if(!des) {
            return this.formBuilder.group({
                description: '',
            });
        }else{
            return this.formBuilder.group({
                description: des.description,
            });
        }
    }
    initForm(job?) {
        if (!job) {
            this.editJobForm = this.formBuilder.group({
                assignedTo: [{}, Validators.required],
                title: ["", Validators.required],
                endDate: ["", Validators.required],
                price: ["", Validators.required],
                clientRoomId: [""],
                description: ["", Validators.required],
                attachments: [[], Validators.required],
                client: [{}, Validators.required],
                details: this.formBuilder.array([this.createDetail()]),
                status: [],
                category: [{}, Validators.required],
            });
        } else {
            this.job = job;
            if (job.assignedTo) {
                job.assignedTo = {
                    ...job.assignedTo,
                    displayName: job.assignedTo.name,
                };
                this.selectedFreelancer = [job.assignedTo];
            }
            this.selectedClient = [job.client];
            this.selectedCategory = job.category.name;
            this.selectedStat = this.statusList.filter((ele) => {
                return ele.id === job.status;
            });
            this.selectedFiles = job.attachments.map((link) => {
                return {name: link.split("/uploads/")[1].substr(14), location: link};
            });
            this.editJobForm = this.formBuilder.group({
                assignedTo: [job.assignedTo],
                title: [job.title, Validators.required],
                endDate: [job.endDate.split("T")[0], Validators.required],
                price: [job.price, Validators.required],
                category: [job.category, Validators.required],
                clientRoomId: [job.clientRoomId],
                status: [job.status],
                details: this.formBuilder.array(job.description.map((description) => this.createDetail({ description }))),
                description: [job.description, Validators.required],
                attachments: [job.attachments, Validators.required],
                client: [job.client, Validators.required],
            });
            // this.populateDescriptionArray(job.description);
        }
    }
    addDetail(index) {
        this.details.insert(index + 1, this.createDetail());
    }

    removeDetail(index: number) {
        this.details.removeAt(index);
    }

    inItContentHeader() {
        this.contentHeader = {
            headerTitle: "Jobs",
            actionButton: false,
            breadcrumb: {
                type: "",
                links: [
                    {
                        name: "Jobs",
                        isLink: true,
                        link: this.backLink,
                    },
                    {
                        name: "Edit Job",
                        isLink: false,
                    },
                ],
            },
        };
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

    onChangeAttachment(event: any) {
        if (event.target.files.length > 0) {
            let tempFlag =
                this.selectedFiles.findIndex(
                    (f) => f.name === event.target.files[0].name
                ) > -1;
            const file = event.target.files[0];
            let extension = file.name.split(".").pop();
            if (ALLOWED_EX.findIndex((ex) => extension === ex) < 0) {
                this.toastr.warning(`.${extension} files are not allowed`);
                this.fileInput.nativeElement.value = null;
                return;
            }
            //check for duplicate files
            this.selectedFiles = tempFlag
                ? this.selectedFiles
                : [...this.selectedFiles, file];
            this.fileInput.nativeElement.value = null;
        }
    }

    handleFileRemove(f) {
        this.selectedFiles = this.selectedFiles.filter(
            (file) => file.name !== f.name
        );
        // if file is already upload we check by location key and delete from server
        if (f.location && f.location.includes("/uploads/")) {
            this.jobService
                .removeJobAttachment(this.job._id, f.location)
                .subscribe((res) => {
                    this.toastr.success(`"${f.name}" deleted succesfully`, "Deleted", {
                        toastClass: "toast ngx-toastr",
                        closeButton: true,
                    });
                });
        }
    }

    onSubmit() {
        this.submitted = true;

        this.editJobForm.controls["assignedTo"].setValue(
            this.freelancers.filter((f) => f.id === this.selectedFreelancer[0]?.id)[0]
        );
        this.editJobForm.controls["client"].setValue(
            this.clients.filter((c) => c.id === this.selectedClient[0]?.id)[0]
        );
        this.editJobForm.controls["category"].setValue(
            this.actualCategories.filter((c) => c.name === this.selectedCategory)[0]
        );
        this.editJobForm.controls["attachments"].setValue(this.selectedFiles);
        this.editJobForm.controls["status"].setValue(this.selectedStat[0].id);

        let isFormInvalid = false;

        Object.keys(this.editJobForm.controls).forEach(key => {
            if (key !== 'attachments' && key !== 'description'
                && this.editJobForm.controls[key].invalid) {
                isFormInvalid = true;
                return;
            }
        });
        const descriptionArray = this.details.value.map((detail: any) => detail.description);

        console.log(descriptionArray);
        if (!descriptionArray || descriptionArray.length === 0 || descriptionArray[0] === '') {
            isFormInvalid = true;
        }


        if (isFormInvalid) {
            this.mandatoryFieldsError('Please fill out all mandatory fields!');
            return;
        }
        let formData = new FormData();
        if (this.f["assignedTo"].value) {
            formData.append("assignedTo", JSON.stringify(this.f["assignedTo"].value));
        }
        formData.append("title", this.f["title"].value);
        formData.append("endDate", this.f["endDate"].value);
        formData.append("price", this.f["price"].value);
        if (this.f["clientRoomId"].value) {
            formData.append("clientRoomId", this.f["clientRoomId"].value);
        }
        this.selectedFiles;
        this.selectedFiles.forEach((element) => {
            if (!element.location) {
                formData.append("attachments", element);
            }
        });

        descriptionArray.forEach((value, index) => {
            formData.append(`description[${index}]`, value);
        });
        formData.append("client", JSON.stringify(this.f["client"].value));
        formData.append("category", JSON.stringify(this.f["category"].value));
        formData.append("status", this.f["status"].value);
        this.jobService.update(this.job._id, formData).subscribe((res) => {
            this.toastr.success(
                `Job "${this.f["title"].value}" updated succesfully`,
                "Updated",
                {
                    toastClass: "toast ngx-toastr",
                    closeButton: true,
                }
            );
            this.router.navigate(["/admin/jobs"]);
        });
    }
    mandatoryFieldsError(msg) {
        this.toastr.error(msg, "Error", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
        });
    }
}
