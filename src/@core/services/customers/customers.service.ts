import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  list: any;
  requestData = {
    req: ''
  }

  constructor(
    private httpserive: HttpService,
  ) { }

}
