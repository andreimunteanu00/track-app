package com.isi.tracking.services;

import com.isi.tracking.models.Shipment;

public interface ShipmentFactory {
    Shipment makeShipment(Long trackingNumber);
}
