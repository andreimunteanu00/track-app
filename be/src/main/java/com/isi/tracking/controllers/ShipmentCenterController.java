package com.isi.tracking.controllers;

import com.isi.tracking.models.ShipmentCenter;
import com.isi.tracking.services.ShipmentCenterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/center")
public class ShipmentCenterController {

    static private final HttpHeaders httpHeaders = new HttpHeaders();

    static {
        httpHeaders.set("Access-Control-Allow-Origin", "http://localhost:4200");
    }

    @Autowired
    private ShipmentCenterService shipmentCenterService;

    @GetMapping(path = "{id}")
    ResponseEntity<ShipmentCenter> getShipmentCenterById(@PathVariable("id") String id) {

        ShipmentCenter shipment = shipmentCenterService.getShipmentCenterById(id);

        if (shipment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(shipment, httpHeaders, HttpStatus.OK);
    }

    @GetMapping
    ResponseEntity<List<ShipmentCenter>> getAllShipmentCenters() {

        return new ResponseEntity<>(shipmentCenterService.getAllShipmentCenters(), httpHeaders, HttpStatus.OK);
    }

    @PostMapping
    ResponseEntity<ShipmentCenter> createShipmentCenter(@RequestBody ShipmentCenter shipmentCenter) {

        return new ResponseEntity<>(shipmentCenterService.storeShipmentCenter(shipmentCenter), httpHeaders, HttpStatus.CREATED);
    }

    @PutMapping
    ResponseEntity<ShipmentCenter> updateShipmentCenter(@RequestBody ShipmentCenter shipmentCenter) {

        return new ResponseEntity<>(shipmentCenterService.updateShipmentCenter(shipmentCenter), httpHeaders, HttpStatus.ACCEPTED);
    }

    @DeleteMapping(path = "{id}")
    ResponseEntity<Void> deleteShipmentCenter(@PathVariable("id") String id) {

        shipmentCenterService.deleteShipmentCenter(id);
        return new ResponseEntity<>(httpHeaders, HttpStatus.OK);
    }
}
