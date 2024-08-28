import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../http/api-end-points';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})

export class PermissionsService {
  constructor(private httpService: HttpService) { }
  create(payLoad: Object) {
    return this.httpService.post(API_ENDPOINTS.PERMISSION, payLoad)
  }
  getPermissions(queryParams?: Object) {
    return this.httpService.get(API_ENDPOINTS.PERMISSION, queryParams)
  }
  delete(permission: String) {
    return this.httpService.delete(API_ENDPOINTS.PERMISSION + '/' + permission)
  }
}
