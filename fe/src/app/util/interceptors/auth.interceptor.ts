import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest, HttpHeaders,
} from "@angular/common/http";

import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders();
    const token = localStorage.getItem("token");
    if (token) {
      headers.set('Authorization', 'Bearer ' + token);
    }
    const clonedRequest = req.clone({headers});
    return next.handle(clonedRequest).pipe(
      tap((res: any) => {
        console.log(res);
      })
    );
  }
}
