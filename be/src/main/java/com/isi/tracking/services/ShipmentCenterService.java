package com.isi.tracking.services;

import com.isi.tracking.models.ShipmentCenter;

import java.util.List;

public interface ShipmentCenterService {
    ShipmentCenter getShipmentCenterById(String id);

    ShipmentCenter storeShipmentCenter(ShipmentCenter shipmentCenter);

    ShipmentCenter updateShipmentCenter(ShipmentCenter shipmentCenter);

    void deleteShipmentCenter(String id);

    List<ShipmentCenter> getAllShipmentCenters();
}
