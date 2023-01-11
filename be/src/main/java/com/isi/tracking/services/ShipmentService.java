package com.isi.tracking.services;

import com.isi.tracking.models.Shipment;

public interface ShipmentService {

    Shipment getShipmentById(String id);

    Shipment storeShipment(Shipment shipment);

    Shipment updateShipment(Shipment shipment);

    void deleteShipment(String id);
}
