import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {Shipment} from "../models/shipment.model";

@Injectable()
export class ShipmentService {
  constructor(private httpClient: HttpClient) { }

  getShipments() {
    return this.httpClient.get<Shipment[]>('http://localhost:8080/shipment')
  }
}
