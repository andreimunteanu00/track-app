import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import {FormBuilder} from "@angular/forms";
import {IUser, User} from "../models/user.model";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  loginForm = this.fb.group({
    username: [],
    password: []
  })

  constructor(private loginService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  login(): void {
    const user: User = this.getUser();
    this.loginService.login(user).subscribe();
  }

  private getUser() {
    const username: string | undefined | null = this.loginForm.get("username")?.value;
    const password: string | undefined | null = this.loginForm.get("password")?.value;
    return new User(username, password);
  }

}
