import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_ENDPOINTS } from "../http/api-end-points";
import { HttpService } from "../http/http.service";
@Injectable({
  providedIn: "root",
})
export class JobService {
  list: any;
  requestData = {
    req: "",
  };

  constructor(private httpService: HttpService) {}

  create(job: Object) {
    return this.httpService.post(API_ENDPOINTS.JOB, job);
  }
  update(id: String, job: Object) {
    return this.httpService.put(API_ENDPOINTS.JOB + "/" + id, job);
  }
  getJobs(queryParams?: Object) {
    return this.httpService.get(API_ENDPOINTS.JOB, queryParams);
  }
  getAllJobs(queryParams?: Object) {
    return this.httpService.get(API_ENDPOINTS.JOB, queryParams);
  }
  getJobById(id: String) {
    return this.httpService.get(API_ENDPOINTS.JOB + "/" + id);
  }
  delete(id: String) {
    return this.httpService.delete(API_ENDPOINTS.JOB + "/" + id);
  }
  removeJobAttachment(id: String, address: String) {
    return this.httpService.put(API_ENDPOINTS.JOB + "/attachment/" + id, {
      address,
    });
  }
}
