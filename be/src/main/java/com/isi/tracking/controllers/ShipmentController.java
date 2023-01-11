package com.isi.tracking.controllers;

import com.isi.tracking.models.Shipment;
import com.isi.tracking.services.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ShipmentController {

    static private final HttpHeaders httpHeaders = new HttpHeaders();

    static {
        httpHeaders.set("Access-Control-Allow-Origin", "http://localhost:4200");
    }
    @Autowired
    private ShipmentService shipmentService;

    @GetMapping(path = "/shipment")
    ResponseEntity<List<Shipment>> getShipments() {
        return new ResponseEntity<>(shipmentService.getShipments(), httpHeaders, HttpStatus.OK);
    }

    @GetMapping(path = "/shipment/{id}")
    ResponseEntity<Shipment> getShipmentById(@PathVariable("id") String id) {

        Shipment shipment = shipmentService.getShipmentById(id);

        if (shipment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(shipment, httpHeaders, HttpStatus.OK);
    }

    @PostMapping(path = "/shipment")
    ResponseEntity<Shipment> createShipment(@RequestBody Shipment shipment) {

        return new ResponseEntity<>(shipmentService.storeShipment(shipment), httpHeaders, HttpStatus.CREATED);
    }

    @PutMapping(path = "/shipment")
    ResponseEntity<Shipment> updateShipment(@RequestBody Shipment shipment) {

        return new ResponseEntity<>(shipmentService.updateShipment(shipment), httpHeaders, HttpStatus.ACCEPTED);
    }

    @DeleteMapping(path = "/shipment/{id}")
    ResponseEntity<Void> deleteShipment(@PathVariable("id") String id) {

        shipmentService.deleteShipment(id);
        return new ResponseEntity<>(httpHeaders, HttpStatus.OK);
    }
}

