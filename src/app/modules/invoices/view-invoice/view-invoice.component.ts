import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { InvoiceService } from "@core/services/invoice/invoices.service";

@Component({
  selector: "app-view-invoice",
  templateUrl: "./view-invoice.component.html",
  styleUrls: ["./view-invoice.component.scss"],
})
export class ViewInvoiceComponent implements OnInit {
  invoice: any = {};
  constructor(private route: ActivatedRoute,private invoiceServcie:InvoiceService) {}

  ngOnInit(): void {
    const invoiceId = this.route.snapshot.paramMap.get("id");
    this.invoiceServcie.getInvoiceById(invoiceId).subscribe((res: any) => {
      this.invoice = res
    });
  }
  printDiv() {
    const printContents = document.getElementById('printRef').innerHTML;
     const originalContents = document.body.innerHTML;
     document.body.innerHTML = printContents;
     window.print();
     document.body.innerHTML = originalContents;
  }
}
