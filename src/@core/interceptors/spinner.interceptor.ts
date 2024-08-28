import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {SpinnerService} from "../services/spinner.service";
import {finalize} from "rxjs/operators";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {


  constructor(private spinnerService: SpinnerService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.show(); // Show the spinner

    return next.handle(request).pipe(
        finalize(() => {
          this.spinnerService.hide(); // Hide the spinner when the request completes
        })
    );
  }
}

