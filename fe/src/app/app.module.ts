import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { EsriMapComponent } from "./pages/esri-map/esri-map.component";
import { AppRoutingModule } from "./app-routing.module";
import {HomeComponent} from "./pages/home/home.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ShipmentService} from "./services/shipment.service";

@NgModule({
  declarations: [AppComponent, EsriMapComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
