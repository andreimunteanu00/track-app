import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../auth.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    protected fb: FormBuilder,
    protected authService: AuthService,
    protected router: Router
  ) {}

  registerForm = this.fb.group({
    email: [],
    password: [],
    confirmPassword: []
  })

  ngOnInit(): void {
  }

  register() {
    if (this.registerForm.get("password")?.value !== this.registerForm.get("confirmPassword")?.value) {
      Swal.fire({
        title: "Confirm password doesn't match with passowrd",
        icon: "warning",
        confirmButtonColor: "red"
      })
      return;
    }
    const user = new User(this.registerForm.get("email")?.value, this.registerForm.get("password")?.value)
    this.authService.register(user).subscribe((res: any) => {
      this.router.navigate(['/login']);
    })
  }
}
