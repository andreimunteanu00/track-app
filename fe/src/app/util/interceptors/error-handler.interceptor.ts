import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest, HttpErrorResponse, HttpStatusCode, HttpResponse,
} from "@angular/common/http";

import { Observable } from "rxjs";
import {tap} from "rxjs/operators";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(null, (err: HttpErrorResponse) => {
        switch (err.status) {
          case HttpStatusCode.Unauthorized:
            window.location.href = '/';
            break;
          case HttpStatusCode.Forbidden:
            Swal.fire({
              title: 'Acces Forbidden',
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            })
            break;
          case HttpStatusCode.InternalServerError:
            Swal.fire({
              title: 'Internal Server Error',
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            })
            break;
        }
      })
    )
  }
}
