import {Injectable} from "@angular/core";
import {CLIENT, FREELANCER} from "@core/utilities/constants";
import {API_ENDPOINTS} from "../http/api-end-points";
import {HttpService} from "../http/http.service";

@Injectable({
    providedIn: "root",
})
export class UserService {
    constructor(private httpService: HttpService) {
    }

    update(id: String, user: Object) {
        return this.httpService.put(API_ENDPOINTS.USER + "/" + id, user);
    }

    getClients(queryParams?: Object) {
        return this.httpService.get(API_ENDPOINTS.USER, {
            ...queryParams,
            userType: CLIENT,
        });
    }

    getProfits(queryParams?: Object) {
        return this.httpService.get(API_ENDPOINTS.PAYMENT + '/getProfits', {
            ...queryParams,
        });
    }

    getAllClients(queryParams?: Object) {
        return this.httpService.get(API_ENDPOINTS.USER + '/getAll', {
            ...queryParams,
            userType: CLIENT,
        });
    }

    getFreelancers(queryParams?: Object) {
        return this.httpService.get(API_ENDPOINTS.USER, {
            ...queryParams,
            userType: FREELANCER,
        });
    }

    updateFreelancer(queryParams?: Object) {
        return this.httpService.put(API_ENDPOINTS.USER + '/updateUserFromAdmin',{
            ...queryParams,
        });
    }
    updateClient(queryParams?: Object) {
        return this.httpService.put(API_ENDPOINTS.USER + '/updateUserFromAdmin',{
            ...queryParams,
        });
    }

    getUserById(id: String) {
        return this.httpService.get(API_ENDPOINTS.USER + "/" + id);
    }

    getTopClients(queryParams?: Object) {
        return this.httpService.get(API_ENDPOINTS.USER + "/clients/top")
    }
}
