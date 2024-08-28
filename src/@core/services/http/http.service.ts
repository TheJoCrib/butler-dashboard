import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from './api-end-points';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(

    private httpClient: HttpClient,

  ) { }

  get(endPoint: String, params?: any) {
    return this.httpClient.get(environment.apiUrl + endPoint, { params })
  }
  post(endPoint: String, payLoad: any, options?: Object) {
    return this.httpClient.post(environment.apiUrl + endPoint, payLoad, options)
  }
  put(endPoint: String, payLoad: any, options?: Object) {
    return this.httpClient.put(environment.apiUrl + endPoint, payLoad, options)
  }
  delete(endPoint: String, options?: Object) {
    return this.httpClient.delete(environment.apiUrl + endPoint, options)
  }

  createOrder(requestData) {
    return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.ORDER.CREATE_ORDER, requestData);
  }

  //   loginUser(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.USER.LOGIN, requestData)
  //   }

  //   setPassword(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.USER.SET_PASSWORD, requestData)
  //   }

  //   getFreelancersList(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.FREELANCERS.FREELANCER_LISTING, requestData)
  //   }

  //   updateFreelancerStatus(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.FREELANCERS.UPDATE_FREELANCER_STATUS, requestData)
  //   }



  //   getOrderList(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.ORDER.ORDER_LISTING, requestData)
  //   }
  //   changePassword(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.USER.CHANGE_PASSWORD, requestData)
  //   }

  //   sendForgotPasswordEmail(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.USER.FORGOT_PASSWORD, requestData)
  //   }

  //   getFreelancersOnboardingInsight() {
  //     return this.httpClient.get(environment.apiUrl + API_ENDPOINTS.DASHBOARD.freelancers_Onboarding_Insight)
  //   }

  //   getMonthlyOrderData() {
  //     return this.httpClient.get(environment.apiUrl + API_ENDPOINTS.DASHBOARD.monthly_order_data)
  //   }

  //   getOnlineFreelancersStats() {
  //     return this.httpClient.get(environment.apiUrl + API_ENDPOINTS.DASHBOARD.online_freelancer_stats)
  //   }

  //   getPapularVehicles() {
  //     return this.httpClient.get(environment.apiUrl + API_ENDPOINTS.DASHBOARD.popular_vehicles)
  //   }

  //   getRecentOrder() {
  //     return this.httpClient.get(environment.apiUrl + API_ENDPOINTS.DASHBOARD.recent_order)
  //   }

  //   getOrderTrends() {
  //     return this.httpClient.get(environment.apiUrl + API_ENDPOINTS.DASHBOARD.order_trends)
  //   }

  //   getVehicleList() {
  //     return this.httpClient.get(environment.apiUrl + API_ENDPOINTS.VEHICLE.vehicle_type_listing)
  //   }


  //   addNewVehicleType(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.VEHICLE.add_new_vehicle_type, requestData)
  //   }

  //   updateVehicleTypeDetails(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.VEHICLE.update_vehicle_type_details, requestData)
  //   }

  //   updateVehicleStatus(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.VEHICLE.update_vehicle_type_status, requestData)
  //   }

  //   getCitiesList() {
  //     return this.httpClient.get(environment.apiUrl + API_ENDPOINTS.CITIES.cities_listing)
  //   }

  //   updateCityStatus(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.CITIES.update_cities_status, requestData)
  //   }

  //   getUserList() {
  //     return this.httpClient.get(environment.apiUrl + API_ENDPOINTS.USER.users_listing)
  //   }

  //   addNewUser(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.USER.add_new_user, requestData)
  //   }

  //   updateUserDetails(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.USER.update_user_details, requestData)
  //   }

  //   updateUserStatus(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.USER.update_user_status, requestData)
  //   }

  //   getAnnouncementList() {
  //     return this.httpClient.get(environment.apiUrl + API_ENDPOINTS.Announcement.announcement_listing)
  //   }

  //   addNewAnnouncement(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.Announcement.add_new_announcement, requestData)
  //   }

  //   updateAnnouncementDetails(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.Announcement.update_announcement_details, requestData)
  //   }

  //   updateAnnouncementStatus(requestData: any) {
  //     return this.httpClient.post(environment.apiUrl + API_ENDPOINTS.Announcement.update_announcement_status, requestData)
  //   }


}

