import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    private router: Router,
    protected authService: AuthService
  ) {}

  ngOnInit(): void {
  }

  checkLogin(): boolean {
    return this.authService.isLogged();
  }

  logout() {
    return this.authService.logout();
  }

}
