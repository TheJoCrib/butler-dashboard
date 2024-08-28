import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  requestData = {
    req: ''
  }

  constructor(
    private httpserive: HttpService,
  ) {
  }
  list: any;
 
}

