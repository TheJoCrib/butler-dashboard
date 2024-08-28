import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../http/api-end-points';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})

export class PaymentService {
  constructor(private httpService: HttpService) { }
  create(payLoad: Object) {
    return this.httpService.post(API_ENDPOINTS.PAYMENT, payLoad)
  }
  update(payLoad: Object,id:String) {
    return this.httpService.put(API_ENDPOINTS.PAYMENT+'/'+id, payLoad)
  }
  getAll(queryParams?: Object) {
    return this.httpService.get(API_ENDPOINTS.PAYMENT, queryParams)
  }
  getById(paymentId: String) {
    return this.httpService.delete(API_ENDPOINTS.PAYMENT + '/' + paymentId)
  }
}
