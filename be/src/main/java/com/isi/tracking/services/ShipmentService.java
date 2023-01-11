package com.isi.tracking.services;

import com.isi.tracking.models.Shipment;

import java.util.List;

public interface ShipmentService {

    List<Shipment> getShipments();

    Shipment getShipmentById(String id);

    Shipment storeShipment(Shipment shipment);

    Shipment updateShipment(Shipment shipment);

    void deleteShipment(String id);
}
