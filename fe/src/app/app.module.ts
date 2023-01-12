import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './util/navbar/navbar.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthService} from "./auth/auth.service";
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";
import {ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import {AuthInterceptor} from "./util/interceptors/auth.interceptor";
import { LoadingScreenComponent } from './util/loading-screen/loading-screen.component';
import {LoadingScreenInterceptor} from "./util/interceptors/loading-screen.interceptor";
import {ErrorHandlerInterceptor} from "./util/interceptors/error-handler.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    LoadingScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    JwtHelperService,
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingScreenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
