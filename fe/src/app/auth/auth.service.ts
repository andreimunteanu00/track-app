import {Injectable} from '@angular/core';
import {BehaviorSubject, first, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import {IUser, User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  resourceUrl = 'http://localhost:8080/api/auth';
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(
    protected http: HttpClient,
    protected router: Router,
    protected jwtHelper: JwtHelperService
  ) {}

  login(user: User) {
    return this.http.post(this.resourceUrl + "/login", user, { observe: "response" })
      .pipe(
        first(),
        tap((res: any) => {
          this.isUserLoggedIn$.next(true);
          localStorage.setItem("token", res.body.token);
          this.router.navigate(["/"]);
        })
      );
  }

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }

  register(user: IUser) {
    return this.http.post(this.resourceUrl + "/register", user, { observe: "response" });
  }

  hasRole(role: string): boolean {
    const encodedToken = localStorage.getItem("token");
    const token = this.jwtHelper.decodeToken(encodedToken!);
    return token.role === role;
  }

  isLogged(): boolean {
    const encodedToken = localStorage.getItem("token");
    return !!encodedToken;
  }

  /**
  method to be used for searching specific user data
   */
  getCurrentUserId(): string {
    const encodedToken = localStorage.getItem("token");
    const token = this.jwtHelper.decodeToken(encodedToken!);
    return token.sub;
  }

}
