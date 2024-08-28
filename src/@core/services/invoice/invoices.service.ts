import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_ENDPOINTS } from "../http/api-end-points";
import { HttpService } from "../http/http.service";
@Injectable({
  providedIn: "root",
})
export class InvoiceService {
  list: any;
  requestData = {
    req: "",
  };

  constructor(private httpService: HttpService) {}

  create(invoice: Object) {
    return this.httpService.post(API_ENDPOINTS.INVOICE, invoice);
  }
  update(id: String, invoice: Object) {
    return this.httpService.put(API_ENDPOINTS.INVOICE + "/" + id, invoice);
  }
  getInvoices(queryParams?: Object) {
    return this.httpService.get(API_ENDPOINTS.INVOICE, queryParams);
  }
  getInvoiceById(id: String) {
    return this.httpService.get(API_ENDPOINTS.INVOICE + "/" + id);
  }
  getInvoicePDF(id: String) {
    return this.httpService.get(API_ENDPOINTS.INVOICE + "/pdf/" + id);
  }
  sendInvoice(jobId: String) {
    return this.httpService.get(API_ENDPOINTS.INVOICE + "/send/" + jobId);
  }
  delete(id: String) {
    return this.httpService.delete(API_ENDPOINTS.INVOICE + "/" + id);
  }
}
