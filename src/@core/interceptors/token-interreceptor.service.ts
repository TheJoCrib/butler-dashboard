import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/authentication/token.service';
import { environment } from 'environments/environment';
import { API_ENDPOINTS } from '@core/services/http/api-end-points';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public token: TokenService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url != environment.apiUrl + API_ENDPOINTS) {
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${this.token.getToken()}`,
                    'Accept': 'text/json',
                },
                responseType: 'json'
            });

            // remove Content-Type for FormData api request
            // if(typeof (request.body) == typeof (FormData)) {
            //     console.log('form-data type selected');
            //     if (request.headers.has('Content-Type')) {
            //         request = request.clone({ headers: request.headers.delete('Content-Type','application/json') });  
            //     }
            // }
        }

        return next.handle(request);
    }

}