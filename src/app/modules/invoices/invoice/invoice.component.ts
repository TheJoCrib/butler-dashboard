import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import { InvoiceService } from "@core/services/invoice/invoices.service";
import _ from "lodash";
import { ColumnMode } from "@swimlane/ngx-datatable";
import {ActivatedRoute, Router} from "@angular/router";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from "@angular/forms";
import { UserService } from "@core/services/user/user.service";
import { JobService } from "@core/services/jobs/job.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.scss"],
})
export class InvoiceComponent implements OnInit, AfterViewInit {
  @ViewChild('dialogCreateInvoice', { static: false }) dialogBtn!: ElementRef;
  dropdownSettings: IDropdownSettings = {};
  addInvoiceModal: NgbActiveModal;
  invoices = [];
  totalCount = 0;
  loader = false;
  offset = 0;
  showFilters = false;
  public pageSize = 10;
  singleDate = "";
  searchRange = {};
  amountPayable = 0;
  contentHeader = {};
  query = {
    pageSize: this.pageSize,
    pageNo: this.offset + 1,
    q: "",
    singleDate: "",
    amountPayable: 0,
  };
  public ColumnMode = ColumnMode;
  clients = [];
  selectedClient = [];
  jobs = [];
  selectedJob = [];
  invoiceForm: any;
  usersQuery = {};
  preSelectedClient = null;
  fromChat = false;
  @ViewChild('addInvoiceModal', { static: false }) addInvoiceDialog: any;


  constructor(
    private invoiceService: InvoiceService,
    private modalService: NgbModal,
    private userService: UserService,
    private jobService: JobService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toast :ToastrService
  ) {}

  ngOnInit(): void {

    this.contentHeader = {
      headerTitle: "Invoices",
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
    this.dropdownSettings = {
      singleSelection: true,
      idField: "id",
      textField: "displayName",
      itemsShowLimit: 5,
      allowRemoteDataSearch: true,
      allowSearchFilter: true,
    };
    this.initForm();
    this.getClients();
    this.getInvoices();

  }
  openCreateInvoice(addInvoiceModal) {
    this.modalService.open(addInvoiceModal, {
      centered: true,
      size: "md",
    });
  }
  ngAfterViewInit() {
    this.modalService.activeInstances.subscribe((res) => {
      //initializing modal
      this.addInvoiceModal = res ? res[0] : null;
    });
    this.route.queryParams.subscribe(params => {
      if(params && params.param){
        this.fromChat = true;
        this.preSelectedClient = params.param;
        this.dialogBtn.nativeElement.click();
      }else{
        this.fromChat=false;
      }
    });
  }
  createInvoice() {
    if (this.invoiceForm.invalid) {
      return;
    }
    let invoicePayload = {};
    invoicePayload["consumer"] = this.selectedClient[0].id;
    invoicePayload["dueDate"] = this.invoiceForm.get("dueDate").value;
    invoicePayload["job"] = this.selectedJob[0]?.id;
    invoicePayload["amountPayable"] = this.invoiceForm.get("amountPayable").value;
    this.invoiceService.create(invoicePayload).subscribe((res) => {
      this.toast.success("Invoice Created Succesfully", "Created!", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });      this.closeAddModal()
    });
  }
  initForm() {
    this.invoiceForm = this.formBuilder.group({
      dueDate: ["", Validators.required],
      amountPayable: ["", Validators.required],
    });
  }
  viewInvoice(id: String) {
    this.router.navigate(["/admin/invoices/details-view", id]);
  }
  getPDFInvoice(id: String) {
    this.invoiceService.getInvoicePDF(id).subscribe((res: any) => {
      let parsed = JSON.parse(res.result);
      var file = new Blob([parsed.data], { type: "application/pdf" });
      var fileURL = URL.createObjectURL(file);
      // if you want to open PDF in new tab
      window.open(fileURL);
      var a = document.createElement("a");
      a.href = fileURL;
      a.target = "_blank";
      a.download = "bill.pdf";
      document.body.appendChild(a);
      a.click();
    });
  }
  searchJobs(e: any) {
    this.query = { ...this.query, q: e.target.value };
    _.debounce(() => {
      this.getInvoices();
    }, 500)();
  }
  changePageSize() {
    this.offset = 0;
    this.query = { ...this.query, pageNo: 1, pageSize: this.pageSize };
    this.getInvoices();
  }
  closeAddModal() {
    this.initForm();
    this.selectedClient = [];
    this.selectedJob = [];
    this.addInvoiceModal.close();

    this.getInvoices();
  }
  changeClient(e?: any) {
    this.jobs = [];
    this.selectedJob = [];
    //this.selectedPayment.job.id incase of editing
    this.jobService.getJobs({ clientId: e?.id }).subscribe((res: any) => {
      this.jobs = res.data;
      this.jobs = this.jobs.map((j) => {
        return { id: j._id, displayName: j.title };
      });
    });
  }
  toggleFilter() {
    this.showFilters = !this.showFilters;
    if (!this.showFilters) {
      this.query = {
        ...this.query,
        ...this.searchRange,
        singleDate: this.singleDate,
        amountPayable: this.amountPayable,
      };
      this.getInvoices();
    }
  }
  onDateSelection(event: Event) {}
  setPage(pageInfo) {
    this.offset = pageInfo.offset;
    this.query = { ...this.query, pageNo: this.offset + 1 };
    this.getInvoices();
  }
  onSearchClients(searchText: any) {
    this.usersQuery = { ...this.usersQuery, q: searchText };
    this.getClients();
  }
  getInvoices() {
    this.invoiceService.getInvoices(this.query).subscribe((res: any) => {
      this.invoices = res.data;
      this.totalCount = res.totalCount;
    });
  }
  getClients() {
    this.userService.getAllClients(this.usersQuery).subscribe((res: any) => {
      this.clients = res.data.map((c) => {
        return {
          id: c._id,
          displayName: `${c.fullName}`,
          name: c.fullName,
          email: c.email,
        };
      });
      if(this.fromChat){
        const clientFound = this.clients.find(value => value.id == this.preSelectedClient);
        this.selectedClient=[ { id: clientFound.id, displayName: clientFound.displayName}];
        this.changeClient({ id: clientFound.id, displayName: clientFound.displayName})
      }
    });
  }

}
