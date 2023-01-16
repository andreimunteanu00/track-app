import {Component, OnInit} from '@angular/core';
import {HistoryService} from "../history.service";
import {IShip} from "../../../models/ship.model";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit {

  shipments: IShip[];

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.historyService.getUserShipments().subscribe((res: IShip[]) => {
      this.shipments = res;
    })
  }

  newShipment() {

  }
}
