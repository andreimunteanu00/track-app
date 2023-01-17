import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import {AuthService} from "../../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const helper = new JwtHelperService();
    const token = localStorage.getItem("token");
    if (token && !helper.isTokenExpired(token)) {
      return true;
    } else {
      this.router.navigate(["login"]);
      return false;
    }
  }
}
