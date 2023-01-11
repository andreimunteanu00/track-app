import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ShipmentService {
  constructor(private httpClient: HttpClient) { }

  getShipments() {
    return this.httpClient.get('http://localhost:8080/shipment')
  }
}
