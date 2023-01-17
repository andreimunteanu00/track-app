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

    private static Double[] airportLatitudes = {
            35.5387974,
            31.18765,
            51.8762646,
            44.3127651,
            33.9415889,
            40.6413113,
            49.0080713,
            39.9803176,
            52.3661052,
            32.8998091,
    };

    private static Double[] airportLongitudes = {
            139.7826839,
            121.3485213,
            -0.373935,
            23.8764024,
            -118.4107187,
            -73.780327,
            2.548755,
            -2.8222503,
            13.4947791,
            -97.0425239,
    };

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

        switch (shippingMethods[shippingMethodIndex]) {
            case AERIAL -> {
                int startAirportIndex = random.nextInt(airportLatitudes.length);
                int endAirportIndex = random.nextInt(airportLatitudes.length);

                shipment.setStartLat(airportLatitudes[startAirportIndex]);
                shipment.setStartLong(airportLongitudes[startAirportIndex]);

                shipment.setEndLat(airportLatitudes[endAirportIndex]);
                shipment.setEndLong(airportLongitudes[endAirportIndex]);

                shipment.setCurrentPathIndex(10);
            }

            case AQUATIC -> {
                shipment.setStartLat(random.nextDouble(-90, 90));
                shipment.setStartLong(random.nextDouble(-180, 180));

                shipment.setStartLat(random.nextDouble(-90, 90));
                shipment.setStartLong(random.nextDouble(-180, 180));

                shipment.setCurrentPathIndex(10);
            }

            case TERRESTRIAL -> {
                shipment.setStartLat(random.nextDouble(-90, 90));
                shipment.setStartLong(random.nextDouble(-180, 180));

                shipment.setStartLat(random.nextDouble(-90, 90));
                shipment.setStartLong(random.nextDouble(-180, 180));

                shipment.setCurrentPathIndex(10);
            }
        }



        shipment.setCurrentLat(shipment.getStartLat());
        shipment.setCurrentLong(shipment.getCurrentLong());

        return shipment;
    }
}
