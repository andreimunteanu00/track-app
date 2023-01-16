package com.isi.tracking.controllers;

import com.isi.tracking.services.ShipmentFactory;
import com.isi.tracking.services.ShipmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.isi.tracking.models.Shipment;

@RestController
@AllArgsConstructor
@RequestMapping("api/shipment")
public class ShipmentController {

    private ShipmentService shipmentService;
    private ShipmentFactory shipmentFactory;

    @GetMapping(path = "{id}")
    ResponseEntity<Shipment> getShipmentById(@PathVariable("id") String id) {

        Shipment shipment = shipmentService.getShipmentById(id);

        if (shipment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(shipment, HttpStatus.OK);
    }

    @PostMapping
    ResponseEntity<Shipment> createShipment(@RequestBody Shipment shipment) {

        return new ResponseEntity<>(shipmentService.storeShipment(shipment), HttpStatus.CREATED);
    }

    @PostMapping(path = "{trackingNumber}")
    ResponseEntity<Shipment> createRandomShipment(@PathVariable("trackingNumber") Long trackingNumber) {
        return new ResponseEntity<>(
                shipmentService.storeShipment(shipmentFactory.makeShipment(trackingNumber)),
                HttpStatus.CREATED
        );
    }

    @PutMapping
    ResponseEntity<Shipment> updateShipment(@RequestBody Shipment shipment) {

        return new ResponseEntity<>(shipmentService.updateShipment(shipment), HttpStatus.ACCEPTED);
    }

    @DeleteMapping(path = "{id}")
    ResponseEntity<Void> deleteShipment(@PathVariable("id") String id) {

        shipmentService.deleteShipment(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
