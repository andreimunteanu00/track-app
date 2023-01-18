package com.isi.tracking.config;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.WriteResult;
import com.isi.tracking.models.Shipment;
import com.isi.tracking.services.AuthService;
import com.isi.tracking.services.ShipmentService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.List;

@Configuration
@EnableScheduling
@AllArgsConstructor
public class SchedulerConfig {

    private final ShipmentService shipmentService;
    private final AuthService authService;

    @Scheduled(fixedDelay = 1000 * 60 * 15)
    private void updateShipment() {
        List<Shipment> shipmentArrayList = shipmentService.getAllShipments();
        shipmentArrayList.forEach(shipment -> {
            if (shipment.getCurrentPathIndex() != null && shipment.getCurrentPathIndex() < 200) {
                shipment.setCurrentPathIndex(shipment.getCurrentPathIndex() + 1);
            }
        });
        shipmentService.updateAllShipments(shipmentArrayList);
    }

}
