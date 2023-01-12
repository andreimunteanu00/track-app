import { Component } from '@angular/core';
import {AuthService} from "../auth.service";
import {FormBuilder} from "@angular/forms";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = this.fb.group({
    email: [],
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
    const email: string | undefined | null = this.loginForm.get("email")?.value;
    const password: string | undefined | null = this.loginForm.get("password")?.value;
    return new User(email, password);
  }

}
