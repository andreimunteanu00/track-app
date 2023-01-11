import {Component, OnInit} from "@angular/core";
import {Shipment} from "../../models/shipment.model";
import {ShipmentService} from "../../services/shipment.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [ShipmentService]
})
export class HomeComponent implements OnInit {
    shipments: Shipment[];

    constructor(private shipmentService: ShipmentService) { }

    ngOnInit() {
      this.shipmentService.getShipments().subscribe(value => {
        console.log(value)
      })
    }
}
