package com.isi.tracking.services.impl;

import com.isi.tracking.models.Shipment;
import com.isi.tracking.services.AuthService;
import com.isi.tracking.services.ShipmentFactory;
import com.isi.tracking.utils.ShippingMethodEnum;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Random;

@AllArgsConstructor
@Service
public class ShipmentFactoryImpl implements ShipmentFactory {
    private AuthService authService;

    public Shipment makeShipment(Long trackingNumber) {
        Random random = new Random();

        Shipment shipment = new Shipment();

        int shipmentDays = random.nextInt(3, 15);

        shipment.setTrackingNumber(trackingNumber);
        shipment.setUserId(authService.getCurrentUsername());
        shipment.setStartDate(Date.from(Instant.now()));
        shipment.setEndDate(Date.from(Instant.now().plus(shipmentDays, ChronoUnit.DAYS)));

        ShippingMethodEnum[] shippingMethods = ShippingMethodEnum.values();
        int shippingMethodIndex = random.nextInt(shippingMethods.length);

        shipment.setShippingMethod(shippingMethods[shippingMethodIndex]);

        String[] carriers = {"DHL", "UPS", "FedEx", "SameDay"};
        int carrierIndex = random.nextInt(carriers.length);
        shipment.setCarrier(carriers[carrierIndex]);

        shipment.setCurrentLat(random.nextDouble(-90, 90));
        shipment.setCurrentLong(random.nextDouble(-180, 180));

        return shipment;
    }
}
