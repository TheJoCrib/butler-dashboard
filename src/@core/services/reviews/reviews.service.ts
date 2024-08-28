import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_ENDPOINTS } from "../http/api-end-points";
import { HttpService } from "../http/http.service";
@Injectable({
  providedIn: "root",
})
export class ReviewsService {
  list: any;
  requestData = {
    req: "",
  };

  constructor(private httpService: HttpService) {}


  getAllReviews() {
    return this.httpService.get(API_ENDPOINTS.REVIEW + "/getAllReviews/", {
    });
  }
}
