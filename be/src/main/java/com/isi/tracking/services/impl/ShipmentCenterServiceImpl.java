package com.isi.tracking.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import com.isi.tracking.services.ShipmentCenterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.isi.tracking.models.ShipmentCenter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class ShipmentCenterServiceImpl implements ShipmentCenterService {

    private final ObjectMapper mapper = new ObjectMapper();
    Logger logger = LoggerFactory.getLogger(ShipmentCenterServiceImpl.class);

    private final String COLLECTION = "shipment_centers";

    @Override
    public ShipmentCenter getShipmentCenterById(String id) {

        try {
            logger.info("Getting shipment center with id {}", id);
            Firestore firestore = FirestoreClient.getFirestore();
            DocumentReference documentReference = firestore.collection(COLLECTION).document(id);
            ApiFuture<DocumentSnapshot> future = documentReference.get();

            DocumentSnapshot document = future.get();

            ShipmentCenter shipmentCenter;

            if(document.exists()) {
                shipmentCenter = document.toObject(ShipmentCenter.class);
                return shipmentCenter;
            }else {
                return null;
            }
        } catch (Exception e) {
            logger.error("Error while getting shipment center with id {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    String.format("Getting shipment center by id: %s failed with exception:\n%s", id, e.getMessage()));
        }
    }

    @Override
    public ShipmentCenter storeShipmentCenter(ShipmentCenter shipmentCenter) {

        try {
            Firestore firestore = FirestoreClient.getFirestore();
            shipmentCenter.setId(UUID.randomUUID().toString());
            logger.info("Storing shipment center with id {}", shipmentCenter.getId());

            ApiFuture<WriteResult> collectionsApiFuture = firestore
                    .collection(COLLECTION)
                    .document(shipmentCenter.getId())
                    .set(shipmentCenter);

            return shipmentCenter;
        } catch (Exception e) {
            logger.error("Error while storing shipment center", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    String.format("Storing shipment center failed with exception:\n%s", e.getMessage()));
        }
    }

    @Override
    public ShipmentCenter updateShipmentCenter(ShipmentCenter shipmentCenter) {

        try {
            logger.info("Updating shipment center with id {}", shipmentCenter.getId());
            Firestore firestore = FirestoreClient.getFirestore();
            ApiFuture<WriteResult> collectionsApiFuture = firestore
                    .collection(COLLECTION)
                    .document(shipmentCenter.getId())
                    .set(shipmentCenter);

            return shipmentCenter;
        } catch (Exception e) {
            logger.error("Error while storing shipment", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    String.format("Storing shipment failed with exception:\n%s", e.getMessage()));
        }
    }

    @Override
    public void deleteShipmentCenter(String id) {

        try {
            logger.info("Deleting shipment with id {}", id);
            Firestore dbFirestore = FirestoreClient.getFirestore();
            ApiFuture<WriteResult> writeResult = dbFirestore.collection(COLLECTION).document(id).delete();
        } catch (Exception e) {
            logger.error("Error while deleting shipment", e);
        }
    }

    @Override
    public List<ShipmentCenter> getAllShipmentCenters() {

        try {
            logger.info("Getting all shipment centers");
            Firestore firestore = FirestoreClient.getFirestore();
            Iterable<DocumentReference> documentReference = firestore.collection(COLLECTION).listDocuments();

            return StreamSupport.stream(documentReference.spliterator(), false)
                    .map(docRef -> {
                        try {
                            return docRef.get().get().toObject(ShipmentCenter.class);
                        } catch (Exception e) {
                            logger.error("Error while getting all shipment centers", e);
                            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                    String.format("Getting all shipment centers failed with exception:\n%s", e.getMessage()));
                        }
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error while getting all shipment centers", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    String.format("Getting all shipment centers failed with exception:\n%s", e.getMessage()));
        }
    }
}
