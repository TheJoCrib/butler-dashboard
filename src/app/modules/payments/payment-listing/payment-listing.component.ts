import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthGuard } from "@core/services/authentication/auth-guard.service";
import { PaymentService } from "@core/services/payment/payment.servcie";
import { UserService } from "@core/services/user/user.service";
import { PERMISSIONS } from "@core/utilities/constants";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { ToastrService } from "ngx-toastr";
import * as feather from "feather-icons";
import { JobService } from "@core/services/jobs/job.service";

@Component({
  selector: "app-payment-listing",
  templateUrl: "./payment-listing.component.html",
  styleUrls: ["./payment-listing.component.scss"],
})
export class PaymentListingComponent implements OnInit {
  payments = [];
  @ViewChild("addPaymentModal", { static: true })
  addPaymentModal: NgbActiveModal;
  loader = false;
  confPerm = PERMISSIONS;
  offset = 0;
  pageSize = 10;
  editPayment = false;
  totalPayments = 0;
  public ColumnMode = ColumnMode;
  contentHeader: object;
  paymentForm: FormGroup;
  dropdownSettings: IDropdownSettings = {};
  dropdownStatusSettings: IDropdownSettings = {};
  usersQuery: Object;
  freelancers = [];
  jobs = [];
  selectedStat = [];
  selectedFreelancer = [];
  selectedJob = [];
  paymentStatusList = [
    { id: "PAID", displayName: "Paid" },
    { id: "UN_PAID", displayName: "UnPaid" },
    { id: "SUSPENDED", displayName: "Suspended" },
  ];
  paymentQuery = {};
  selectedPayment: any;
  dropdownJobSettings = {};

  constructor(
    private authGuardService: AuthGuard,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private toast: ToastrService,
    private jobService: JobService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: true,
      idField: "id",
      textField: "displayName",
      itemsShowLimit: 5,
      allowRemoteDataSearch: true,
      allowSearchFilter: true,
    };
    this.dropdownStatusSettings = {
      singleSelection: true,
      idField: "id",
      textField: "displayName",
      itemsShowLimit: 5,
      allowRemoteDataSearch: true,
      allowSearchFilter: false,
    };
    this.initForm();
    this.getFreelancers();
    this.inItContentHeader();
    this.getPayments();
  }
  ngAfterViewInit() {
    feather.replace();
    this.modalService.activeInstances.subscribe((res) => {
      //initializing modal
      this.addPaymentModal = res ? res[0] : null;
    });
  }
  changeFreelancer(e?: any) {
    this.jobs = [];
    this.selectedJob = [];
    //this.selectedPayment.job.id incase of editing
    this.jobService
      .getJobs({ freelancerId: e?.id || this.selectedPayment.freelancer.id })
      .subscribe((res: any) => {
        this.jobs = res.data;
        this.jobs = this.jobs.map((j) => {
          return { id: j._id, displayName: j.title };
        });
        if (this.selectedPayment) {
          this.selectedJob = this.jobs.filter((j) => {
            return j.id === this.selectedPayment.job.id;
          });
        }
      });
  }
  initForm(payment?) {
    if (!payment) {
      this.selectedPayment = null;
      this.editPayment = false;
      this.paymentForm = this.formBuilder.group({
        paymentDate: ["", Validators.required],
        amount: ["", Validators.required],
      });
    } else {
      this.editPayment = true;
      this.selectedPayment = payment;
      this.selectedFreelancer = this.freelancers.filter((f) => {
        return f.id === payment.freelancer.id;
      });
      this.changeFreelancer();
      this.selectedStat = this.paymentStatusList.filter((s) => {
        return s.id === payment.status;
      });
      this.paymentForm = this.formBuilder.group({
        paymentDate: [payment.paymentDate.split("T")[0], Validators.required],
        amount: [payment.amount, Validators.required],
      });
    }
  }
  getPayments() {
    this.paymentService.getAll(this.paymentQuery).subscribe((res: any) => {
      this.payments = res.data;
      this.totalPayments = res.totalCount;
    });
  }
  searchPayments(e: any) {
    this.paymentQuery["q"] = e.target.value;
    this.getPayments();
  }
  toggleEditView(row, directModalRef?) {
    this.initForm(row);
    //using direct Ref as directModalRef in case this.addPaymentModal is undefined
    this.modalService.open(this.addPaymentModal || directModalRef, {
      centered: true,
      size: "md",
    });
  }
  onSearchFreelancers(searchText: any) {
    this.usersQuery = { ...this.usersQuery, q: searchText };
    this.getFreelancers();
  }
  getFreelancers() {
    this.userService.getFreelancers(this.usersQuery).subscribe((res: any) => {
      this.freelancers = res.data.map((c) => {
        return {
          id: c._id,
          displayName: `${c.fullName}`,
          name: c.fullName,
          email: c.email,
        };
      });
    });
  }
  inItContentHeader() {
    this.contentHeader = {
      headerTitle: "Freelancer Payments",
      actionButton: false,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "",
            isLink: false,
          },
        ],
      },
    };
  }
  changePageSize() {
    this.paymentQuery["pageNo"] = 1;
    this.paymentQuery["pageSize"] = this.pageSize;
    this.offset = 0;
    this.getPayments();
  }
  setPage(pageInfo) {
    this.offset = pageInfo.offset;
    this.paymentQuery = { ...this.paymentQuery, pageNo: this.offset + 1 };
    this.getPayments();
  }
  createPayment() {
    if (this.paymentForm.invalid) {
      return;
    }
    try {
      let paymentPayload = {};
      paymentPayload["freelancer"] = this.selectedFreelancer[0].id;
      paymentPayload["paymentDate"] = this.paymentForm.get("paymentDate").value;
      paymentPayload["status"] = this.selectedStat[0].id;
      paymentPayload["job"] = this.selectedJob[0]?.id;
      paymentPayload["amount"] = this.paymentForm.get("amount").value;
      if (!this.selectedPayment) {
        this.paymentService.create(paymentPayload).subscribe((res) => {
          if (res) {
            this.toast.success("Payment Created Succesfully", "Created!", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.getPayments();
            this.closeAddModal();
          }
        });
      } else if (this.selectedPayment._id) {
        this.paymentService
          .update(paymentPayload, this.selectedPayment._id)
          .subscribe((res) => {
            this.toast.success("Payment Updated Succesfully", "Updated!", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.closeAddModal();
            this.getPayments();
          });
      }
    } catch (error) {
      this.toast.error(error.message);
    }
  }
  closeAddModal() {
    this.initForm();
    this.selectedFreelancer = [];
    this.selectedStat = [];
    this.selectedJob = [];
    this.addPaymentModal.close();
  }
  openCreatePayment(addPaymentModal) {
    this.initForm();
    this.selectedFreelancer = [];
    this.selectedStat = [];
    this.selectedJob = [];
    this.modalService.open(addPaymentModal, {
      centered: true,
      size: "md",
    });
  }
  checkPermission(permission) {
    return this.authGuardService.checkPermisison(permission);
  }
}
