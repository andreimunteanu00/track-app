import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IShip} from "../../models/ship.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HistoryService implements OnInit {

  resourceUrl = 'http://localhost:8080/api/shipment';

  constructor(protected http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(this.resourceUrl + "/my");
  }

  getUserShipments() {
    return this.http.get(this.resourceUrl + "/my");
  }

  createShipmentByTrackNumber(trackNumber: number) {
    return this.http.post(this.resourceUrl + '/' + trackNumber, null, {observe: "response"});
  }
}
