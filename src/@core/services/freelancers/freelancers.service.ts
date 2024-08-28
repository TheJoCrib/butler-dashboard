import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})

export class FreelancersService {

  list: any;
  requestData = {
    req: ''
  }
  selectedFreelancer: any
  constructor(private httpserive: HttpService) {
  }

  setSelectedFreelancer(selectedFreelancer) {
    this.selectedFreelancer = selectedFreelancer
  }

  getSelectedFreelancer() {
    return this.selectedFreelancer
  }

  breadcrumbTitle = ""
  setBreadcrumbTitle(breadcrumbTitle) {
    this.breadcrumbTitle = breadcrumbTitle
  }

  getBreadcrumbTitle() {
    return this.breadcrumbTitle
  }


}