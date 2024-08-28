import { Injectable } from "@angular/core";
import { API_ENDPOINTS } from "../http/api-end-points";
import { HttpService } from "../http/http.service";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  constructor(private httpService: HttpService) {}
  login(payLoad: Object) {
    return this.httpService.post(API_ENDPOINTS.ADMIN + "/login", payLoad);
  }
  create(admin: Object) {
    return this.httpService.post(API_ENDPOINTS.ADMIN, admin);
  }
  update(id: String, admin: Object) {
    return this.httpService.put(API_ENDPOINTS.ADMIN + "/" + id, admin);
  }
  getAdmins(queryParams?: Object) {
    return this.httpService.get(API_ENDPOINTS.ADMIN, queryParams);
  }
  getAdminById(id: String) {
    return this.httpService.get(API_ENDPOINTS.ADMIN + "/" + id);
  }
  delete(id: String) {
    return this.httpService.delete(API_ENDPOINTS.ADMIN + "/" + id);
  }
  forgetPassword(payLoad: Object) {
    return this.httpService.post(
      API_ENDPOINTS.ADMIN + "/" + "forget-password",
      payLoad
    );
  }
  changePassword(payLoad: Object) {
    return this.httpService.post(
      API_ENDPOINTS.ADMIN + "/" + "change-password",
      payLoad
    );
  }
}
