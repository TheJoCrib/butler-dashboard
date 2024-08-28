import {Component, OnInit, Renderer2, ViewChild, ViewEncapsulation,} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FreelancerStatus} from "@core/models/common-models";
import Stepper from "bs-stepper";
import {ToastrService} from "ngx-toastr";
import {Location} from "@angular/common";
import {IDropdownSettings} from "ng-multiselect-dropdown";

import {FreelancersService} from "@core/services/freelancers/freelancers.service";
import {JobService} from "@core/services/jobs/job.service";
import {UserService} from "@core/services/user/user.service";
import {CategoryService} from "@core/services/category/category.service";
import {ALLOWED_EX} from "@core/utilities/constants";

@Component({
    selector: "app-create-job",
    templateUrl: "./create-job.component.html",
    styleUrls: ["./create-job.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CreateJobComponent implements OnInit {
    @ViewChild("fileInput", {static: false}) fileInput: any;
    usersQuery = {jobCount: true, q: "", skills: ""};
    jobsQuery: {};
    dropdownSettings: IDropdownSettings = {};
    dropdownFreelancerSettings: IDropdownSettings = {};
    dropdownCategorySettings: IDropdownSettings = {};
    createJobForm: FormGroup;
    submitted = false;
    freelancers = [];
    freelancersItemSource =[];
    selectedFiles = [];
    clients = [];
    todayDate = new Date().toISOString().split("T")[0];
    selectedClient = [];
    selectedFreelancer = [];
    selectedCategory = null;
    categories = [];
    createJobBy = false;
    public contentHeader: object;
    actualCategories = [];
    backLink = "../requests";
    freelancerStatusForUpdate = "";
    commentsForFreelancerStatusUpdate = "";
    submited = false;

    loader = false;
    rotateDegree = 90;

    private verticalWizardStepper: Stepper;
    private bsStepper;


    constructor(
        private _FreelancersService: FreelancersService,
        private modalService: NgbModal,
        private categoryService: CategoryService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        public location: Location,
        private userService: UserService,
        private renderer: Renderer2,
        private formBuilder: FormBuilder,
        private jobService: JobService,
    ) {
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.createJobForm.controls;
    }

    compareAccounts = (item, selected) => {
        if (selected.path && item.path) {
            return item.path === selected.path;
        }
        if (item.name && selected.name) {
            return item.name === selected.name;
        }
        return false;
    };

    ngOnInit(): void {
        this.verticalWizardStepper = new Stepper(
            document.querySelector("#stepper2"),
            {
                linear: false,
                animation: true,
            }
        );
        // this.createJobBy = this.route.snapshot.paramMap.get('createJobBy')
        this.dropdownSettings = {
            singleSelection: true,
            idField: "id",
            textField: "displayName",
            itemsShowLimit: 5,
            allowRemoteDataSearch: true,
            allowSearchFilter: true,
        };
        this.dropdownFreelancerSettings = {
            singleSelection: true,
            idField: "id",
            textField: "displayName",
            itemsShowLimit: 5,
            allowRemoteDataSearch: true,
            allowSearchFilter: true,
        };
        this.dropdownCategorySettings = {
            singleSelection: true,
            idField: "id",
            textField: "name",
            allowRemoteDataSearch: true,
            allowSearchFilter: true,
        };
        this.bsStepper = document.querySelectorAll(".bs-stepper");

        this.getClients();
        this.getFreelancers();
        this.inItContentHeader();
        this.getCategories();
        this.initForm();
    }

    getClientId() {
        this.route.queryParams.subscribe(params => {
            const clientId = params['param'];
            if (clientId) {
                this.createJobBy = true;
                const matchedClient = this.clients.find(value => value.id === clientId);
                if (matchedClient && this.selectedClient.filter(value => value.id === matchedClient.id).length === 0)
                    this.selectedClient = [{id: matchedClient.id, displayName: matchedClient.displayName}];
            }
        });
    }

    getCategories() {
        this.categoryService.getCategories().subscribe((res: any) => {
            // 'actualCategories' would also contain main/parent skills,
            // whereas  'categories' wont have parent skills
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
    }

    onSearchClients(searchText: any) {
        this.usersQuery = {...this.usersQuery, q: searchText};
        this.getClients();
    }

    onSearchFreelancers(searchText: any) {
        this.usersQuery = {...this.usersQuery, q: searchText};
        this.getFreelancers();
    }

    getClients() {
        this.userService.getAllClients(this.usersQuery).subscribe((res: any) => {
            this.clients = res.data.map((c) => {
                return {
                    id: c._id,
                    name: c.fullName,
                    displayName: `${c.fullName}(${c.email})`,
                    email: c.email,
                };
            });
            this.getClientId();
        });
    }

    getFreelancers() {
        this.userService.getFreelancers(this.usersQuery).subscribe((res: any) => {
            this.freelancers = res.data.map((c) => {
                this.freelancersItemSource = res.data;
                return {
                    id: c._id,
                    displayName: `${c.fullName}(${c.assignedJobs})`,
                    name: c.fullName,
                    email: c.email,
                };
            });
        });
    }

    toggle() {
        this.createJobBy = !this.createJobBy;
    }

    initForm() {
        this.createJobForm = this.formBuilder.group({
            assignedTo: [{}],
            title: ["", Validators.required],
            endDate: ["", Validators.required],
            price: ["", Validators.required],
            category: [{}],
            clientRoomId: [""],
            description: ["", Validators.required],
            details: this.formBuilder.array([this.createDetail()]),
            attachments: [[]],
            client: [{}, Validators.required],
        });
    }
    createDetail(): FormGroup {
        return this.formBuilder.group({
            description: '',
        });
    }
    get details(): FormArray {
        return this.createJobForm.get('details') as FormArray;
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
                        name: "Create Job",
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

    mandatoryFieldsError(msg) {
        this.toastr.error(msg, "Error", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
        });
    }

    changeCat() {
        this.usersQuery = {
            ...this.usersQuery,
            skills: this.selectedCategory,
        };
        this.getFreelancers();
        this.selectedFreelancer = [];
    }

    removeCat(e: any) {
        if (!e.target.checked) {
            this.selectedCategory = null;
        }
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
    }

    getThumbnail(file: any) {
        let ext = file.name.split(".").pop();
        switch (ext.toLowerCase()) {
            case "pdf":
                return "/assets/pdf-thumbnail.png";
            case "jpeg":
                return "/assets/picture.jpg";
            case "docx":
                return "/assets/docx-thumbnail.png";
            case "mp4":
                return "/assets/video-thumbnail.png";
            default:
                return "/assets/simple.png";
        }
    }

    toggleValidators() {
        const control = this.createJobForm.get('assignedTo');
        const control1 = this.createJobForm.get('category');

        if (this.createJobBy) {
            control.setValidators([Validators.required]);
            control1.setValidators(null);

        } else {
            control1.setValidators([Validators.required]);
            control.setValidators(null);
        }

        control.updateValueAndValidity();
    }


    onSubmit() {
        this.toggleValidators();
        this.submitted = true;
        if (this.createJobBy) {
            this.createJobForm.controls["assignedTo"].setValue(
                this.freelancers.filter(
                    (f) => f.id === this.selectedFreelancer[0]?.id
                )[0]
            );
        }
        this.createJobForm.controls["client"].setValue(
            this.clients.filter((c) => c.id === this.selectedClient[0]?.id)[0]
        );
        this.createJobForm.controls["category"].setValue(
            this.actualCategories.filter((c) => c.name === this.selectedCategory)[0]
        );
        this.createJobForm.controls["attachments"].setValue(this.selectedFiles);

        let isFormInvalid = false;

        Object.keys(this.createJobForm.controls).forEach(key => {
            if (key !== 'attachments' && key !== 'description'
                && this.createJobForm.controls[key].invalid) {
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
        if (this.createJobBy) {
            formData.append("assignedTo", JSON.stringify(this.f["assignedTo"].value));
            const selectedFreelancer = this.freelancersItemSource.find(value => value._id === this.selectedFreelancer[0]?.id);
            formData.append("category", JSON.stringify(this.actualCategories.find((c) => c.id === selectedFreelancer.skills[0]._id)));
        }else{
            formData.append("category", JSON.stringify(this.f["category"].value));
        }
        formData.append("title", this.f["title"].value);
        formData.append("endDate", this.f["endDate"].value);
        formData.append("price", this.f["price"].value);
        if (this.f["clientRoomId"].value) {
            formData.append("clientRoomId", this.f["clientRoomId"].value);
        }
        if (this.selectedFiles?.length) {
            this.selectedFiles.forEach((element) => {
                formData.append("attachments", element);
            });
        }
        descriptionArray.forEach((value, index) => {
            formData.append(`description[${index}]`, value);
        });
        formData.append("client", JSON.stringify(this.f["client"].value));
        this.jobService.create(formData).subscribe((res) => {
            this.toastr.success(
                `Job "${this.f["title"].value}" created succesfully`,
                "Created",
                {
                    toastClass: "toast ngx-toastr",
                    closeButton: true,
                }
            );
            this.initForm();
            this.router.navigate(["/admin/jobs"]);
        });
    }
}
