import {Component, OnInit, ViewChild} from '@angular/core';
import {HistoryService} from "../history.service";
import {IShip} from "../../../models/ship.model";
import {ModalManager} from "ngb-modal";
import Swal from "sweetalert2";
import {HttpResponse, HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit {

  shipments: IShip[];
  trackNumber: number;
  @ViewChild('myModal') myModal;
  selectedShipment: IShip;

  constructor(
    private historyService: HistoryService,
    private modalService: ModalManager,
    ) {}

  ngOnInit(): void {
    this.historyService.getUserShipments().subscribe((res: IShip[]) => {
      this.shipments = res;
    })
  }

  openNewShipmentModal() {
    this.modalService.open(this.myModal, {
      size: "md",
      modalClass: 'mymodal',
      hideCloseButton: true,
      centered: true,
      backdrop: true,
      animation: true,
      keyboard: false,
      closeOnOutsideClick: true,
      backdropClass: "modal-backdrop"
    });
  }

  newShipment(trackNumber: number) {
    this.historyService.createShipmentByTrackNumber(trackNumber).subscribe(res => {
      if (res.status === HttpStatusCode.Created) {
        Swal.fire({
          icon: "success",
          showConfirmButton: false
        }).then(value => {
          this.modalService.close(this.myModal);
          window.location.reload();
        })
      }
    })
  }
}
