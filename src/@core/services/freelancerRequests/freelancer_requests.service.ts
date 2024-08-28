import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import {API_ENDPOINTS} from "../http/api-end-points";
import {CLIENT} from "../../utilities/constants";

@Injectable({
    providedIn: 'root'
})

export class FreelancerRequestsService {

    constructor(private httpService: HttpService) {
    }


    getAllRequests(queryParams?: Object) {
        return this.httpService.get(API_ENDPOINTS.SKILL_UPDATE+ '/getAllRequests', {
            ...queryParams,
        });
    }
    approveRequest(id) {
        return this.httpService.put(API_ENDPOINTS.SKILL_UPDATE+ '/approve/'+id,{});
    }
    rejectRequest(id) {
        return this.httpService.put(API_ENDPOINTS.SKILL_UPDATE+ '/reject/'+id,{});
    }

}
