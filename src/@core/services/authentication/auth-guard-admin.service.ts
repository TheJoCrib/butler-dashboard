import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router,} from "@angular/router";
import jwtDecode from "jwt-decode";

@Injectable()
export class AuthGuardAdminService implements CanActivate {
    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (this.isAuthenticated()) {
            return true;
        } else {
            this.router.navigateByUrl("/admin/auth");
            return false;
        }
    }


    isAuthenticated() {
        if (localStorage.getItem("access_token")) {
            const decoded = jwtDecode(localStorage.getItem("access_token"));
            const obj = decoded["isAdmin"] === true;
            return obj
        } else {
            return false;
        }
    }
}
