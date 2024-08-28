import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router,} from "@angular/router";
import jwtDecode from "jwt-decode";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot
    ): boolean {
        if (this.isAuthenticated) {
            if (route.data.permission) {
                return this.checkPermisison(route.data.permission);
            }
            return true;
        }
        this.router.navigateByUrl("/admin/auth");
        return false;
    }

    checkPermisison(permission) {
        let user: any = localStorage.getItem("admin");
        user = JSON.parse(user);
        return user?.permissions?.findIndex((e) => e === permission) > -1;
    }

    isAuthenticated() {
        var decoded = jwtDecode(localStorage.getItem("access_token"));
        if (decoded["isAdmin"]) {
            return true;
        } else {
            return false;
        }
    }
}
