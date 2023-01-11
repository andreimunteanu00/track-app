import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest, HttpHeaders,
} from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token");
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*'
      });
      const clonedRequest = req.clone({headers});
      return next.handle(clonedRequest);
    } else {
      const headers = new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      });
      const clonedRequest = req.clone({headers});
      return next.handle(clonedRequest);
    }
  }
}
