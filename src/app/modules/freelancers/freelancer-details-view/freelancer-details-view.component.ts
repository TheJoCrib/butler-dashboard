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
import * as feather from "feather-icons";
import {PaymentService} from "@core/services/payment/payment.servcie";

@Component({
    selector: "app-freelancer-details-view",
    templateUrl: "./freelancer-details-view.component.html",
    styleUrls: ["./freelancer-details-view.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class FreelancerDetailsViewComponent implements OnInit {
    public loading: boolean;
    // FREELANCER VARIABLES
    freelancer: any;
    freelancerId: string;
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
    private verticalWizardStepper: Stepper;
    private bsStepper;
    updateUser={};
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
        private jobService: JobService
    ) {
    }

    // GET http://localhost:4200/null 404 (Not Found)
    ngOnInit(): void {
        // feather.replace();
        this.freelancerId = this.route.snapshot.paramMap.get("id");
        this.query = {freelancerId: this.freelancerId, pageSize: this.pageSize};
        this.getFreelancerData();
        this.getFreelancerJobs();
        this.getTotalEarning();
        this.getPayments();
        this.getCategories();
        this.verticalWizardStepper = new Stepper(
            document.querySelector("#stepper2"),
            {
                linear: false,
                animation: true,
            }
        );
    }

    // feathericons
    ngAfterViewInit() {
        feather.replace();
    }

    getPayments() {
        this.paymentService.getAll(this.query).subscribe((res: any) => {
            this.payments = res.data;
            this.totalPayments = res.totalCount;
        });
    }

    // GETTING FREELANCER DATA
    getFreelancerData() {
        this.loading = true;
        this.userService.getUserById(this.freelancerId).subscribe((res) => {
            this.freelancer = res;
            this.freelancerSkills = this.freelancer.skills;
            this.freelancerPortfolio = this.freelancer.portfolio;
            this.loading = false;
        });
    }

    //FREELANCER JOBS
    getFreelancerJobs() {
        this.jobService.getJobs(this.query).subscribe((res: any) => {
            this.jobs = res.data;
            this.totalJobs = res.totalCount;
        });
    }

    getTotalEarning() {
        this.jobService
            .getJobs({freelancerId: this.freelancerId})
            .subscribe((res: any) => {
                this.totalEarned = res.data?.reduce((a: any, b: any) => {
                    return a + b.price;
                }, 0);
            });
    }

    // RESUME VIEW CHANGE
    viewResume(url: any) {
        window.open(url, "_blank");
    }

    // ADD NEW SKILL

    toggleProfile(freelancer: any) {
        freelancer.isProfileVerified = !freelancer.isProfileVerified;
        this.userService
            .update(freelancer._id, {
                isProfileVerified: freelancer.isProfileVerified,
            })
            .subscribe((res: any) => {
            });
    }

    getFileName(file: any) {
        return file.split(".")[file.split(".").length - 2];
    }

    getThumbnail(file: any) {
        let ext = file.split(".").pop();
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

    setPage(pageInfo, flag) {
        if (flag === "jobs") {
            this.offset = pageInfo.offset;
            this.query = {...this.query, pageNo: this.offset + 1};
            this.getFreelancerJobs();
        }
        if (flag === "payments") {
            this.offset = pageInfo.offset;
            this.query = {...this.query, pageNo: this.offset + 1};

            this.getPayments();
        }
    }

    handlePageLimit(flag: string) {
        this.offset = 0;
        this.query = {
            ...this.query,
            pageSize: this.pageSize,
            pageNo: this.offset + 1,
        };
        if (flag === "jobs") {
            this.getFreelancerJobs();
        }
        if (flag === "payments") {
            this.getPayments();
        }
    }

    handleTabChange(flag) {
        this.pageSize = 10;
        this.offset = 0;
    }

    // BACK TO LISTING BUTTON
    backLink() {
        this.location.back();
    }

    updateFreelancer() {
        this.updateUser['userId']=this.freelancer._id;
        this.userService.updateFreelancer(this.updateUser).subscribe(value => {
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
        console.log('freeLancer: ', this.freelancer)
    }

    changeHandler(event, key) {
        this.updateUser[key] = event.target.value;
        console.log('freelancer: ', this.updateUser)
    }

    getCategories() {
        this.categoryService.getCategories().subscribe((res: any) => {
            this.categories = res.categories.map((c) => {
                return {_id: c._id, name: c.name, path: c.path?.replaceAll(",", "")};
            });
            this.categories = this.categories.filter((item) => {
                return item.path !== undefined;
            });
        });

    }

    changeCat() {
        this.skillPresent = this.freelancerSkills.filter((category: any) => {
            return category.name == this.selectedCategory;
        });
        if (this.skillPresent.length > 0) {
            this.showUpdateButton = false;
            this.toastr.warning(
                `"${this.selectedCategory}" Skill Already Exist`,
                "Warning",
                {
                    toastClass: "toast ngx-toastr",
                    closeButton: true,
                }
            );
        }
        if (this.skillPresent.length == 0) {
            this.showUpdateButton = true;
            this.freelancerSkills.push(
                ...this.categories.filter((category: any) => {
                    return category.name == this.selectedCategory;
                })
            );
            this.selectedCategory = []
        }
    }


    addNewSkill(skill: any) {
        this.freelancerSkills.push(
            ...this.categories.filter((category: any) => {
                return category.name == skill;
            })
        );
        this.categoriesId = this.freelancerSkills.map((skills: any) => {
            return skills._id;
        });
        this.userService
            .update(this.freelancer._id, {skills: this.categoriesId})
            .subscribe((res: any) => {
                this.toastr.success(
                    `Skills Updated Succesfully`,
                    "Updated",
                    {
                        toastClass: "toast ngx-toastr",
                        closeButton: true,
                    }
                );
            });
    }

    deleteSkill(skill: any) {
        this.freelancerSkills = this.freelancerSkills?.filter((skills: any) => {
            return skills.name != skill;
        });
        this.userService
            .update(this.freelancer._id, {skills: this.freelancerSkills})
            .subscribe((res: any) => {
            });
    }

    // Success
    // toastrSuccess(msg) {
    //   this.toastr.success(msg, "Staus Updated!", {
    //     toastClass: "toast ngx-toastr",
    //     closeButton: true,
    //   });
    // }

    // Error
    // toastrError(msg) {
    //   this.toastr.error(msg, "Status Not Updated!", {
    //     toastClass: "toast ngx-toastr",
    //     closeButton: true,
    //   });
    // }

    openImageModal(modalSM, imgae) {
        this.selectedImage = imgae;
        this.modalService.open(modalSM, {
            centered: true,
            size: "lg",
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
