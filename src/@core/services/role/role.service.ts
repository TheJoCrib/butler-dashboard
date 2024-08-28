import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../http/api-end-points';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private httpService: HttpService) { }
  
  create(role: Object) {
    return this.httpService.post(API_ENDPOINTS.ROLE, role)
  }
  update(id:String,role: Object) {
    return this.httpService.put(API_ENDPOINTS.ROLE + '/' + id, role)
  }
  getRoles(queryParams?: Object) {
    return this.httpService.get(API_ENDPOINTS.ROLE, queryParams)
  }
  getRoleById(id: String) {
    return this.httpService.get(API_ENDPOINTS.ROLE + '/' + id)
  }
  delete(id: String) {
    return this.httpService.delete(API_ENDPOINTS.ROLE + '/' + id)
  }
}

