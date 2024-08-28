import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../http/api-end-points';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpService:HttpService) { }
  create(category: Object) {
    return this.httpService.post(API_ENDPOINTS.CATEGORY, category)
  }
  update(id:String,category: Object) {
    return this.httpService.put(API_ENDPOINTS.CATEGORY + '/' + id, category)
  }
  getCategories(queryParams?: Object) {
    return this.httpService.get(API_ENDPOINTS.CATEGORY, queryParams)
  }
  getCategoryById(id: String) {
    return this.httpService.get(API_ENDPOINTS.CATEGORY + '/' + id)
  }
  delete(id: String) {
    return this.httpService.delete(API_ENDPOINTS.CATEGORY + '/' + id)
  }
}
