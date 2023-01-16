package com.isi.tracking.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.isi.tracking.services.AuthService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.isi.tracking.models.Shipment;
import com.isi.tracking.services.ShipmentService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ShipmentServiceImpl implements ShipmentService {
    private final AuthService authService;

    private final ObjectMapper mapper = new ObjectMapper();
    private final Logger logger = LoggerFactory.getLogger(ShipmentServiceImpl.class);

    private final String COLLECTION = "shipments";

    @Override
    public List<Shipment> getUserShipments() {
        try {
            Firestore firestore = FirestoreClient.getFirestore();
            ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION).get();

            QuerySnapshot querySnapshot = future.get();
            List<QueryDocumentSnapshot> documentSnapshots = querySnapshot.getDocuments();

            List<Shipment> shipments = documentSnapshots.stream().map(
                    queryDocumentSnapshot -> queryDocumentSnapshot.toObject(Shipment.class)
            ).filter(
                    shipment -> shipment.getUserId().equals(authService.getCurrentUsername())
            ).collect(Collectors.toList());

            return shipments;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    String.format("Getting shipment by id: %s failed with exception:\n%s", e.getMessage()));
        }
    }

    @Override
    public Shipment getShipmentById(String id) {

        try {
            logger.info("Getting shipment with id {}", id);
            Firestore firestore = FirestoreClient.getFirestore();
            DocumentReference documentReference = firestore.collection(COLLECTION).document(id);
            ApiFuture<DocumentSnapshot> future = documentReference.get();

            DocumentSnapshot document = future.get();

            Shipment shipment;

            if(document.exists()) {
                shipment = document.toObject(Shipment.class);
                return shipment;
            }else {
                return null;
            }
        } catch (Exception e) {
            logger.error("Error while getting shipment with id {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    String.format("Getting shipment by id: %s failed with exception:\n%s", id, e.getMessage()));
        }
    }

    @Override
    public Shipment storeShipment(Shipment shipment) {

        try {
            Firestore firestore = FirestoreClient.getFirestore();
            shipment.setId(UUID.randomUUID().toString());
            logger.info("Storing shipment with id {}", shipment.getId());

            ApiFuture<WriteResult> collectionsApiFuture = firestore
                    .collection(COLLECTION)
                    .document(shipment.getId())
                    .set(shipment);

            return shipment;
        } catch (Exception e) {
            logger.error("Error while storing shipment", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    String.format("Storing shipment failed with exception:\n%s", e.getMessage()));
        }
    }

    @Override
    public Shipment updateShipment(Shipment shipment) {

        try {
            logger.info("Updating shipment with id {}", shipment.getId());
            Firestore firestore = FirestoreClient.getFirestore();
            ApiFuture<WriteResult> collectionsApiFuture = firestore
                    .collection(COLLECTION)
                    .document(shipment.getId())
                    .set(shipment);

            return shipment;
        } catch (Exception e) {
            logger.error("Error while storing shipment", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    String.format("Storing shipment failed with exception:\n%s", e.getMessage()));
        }
    }

    @Override
    public void deleteShipment(String id) {

        try {
            logger.info("Deleting shipment with id {}", id);
            Firestore dbFirestore = FirestoreClient.getFirestore();
            ApiFuture<WriteResult> writeResult = dbFirestore.collection(COLLECTION).document(id).delete();
        } catch (Exception e) {
            logger.error("Error while deleting shipment", e);
        }
    }
}
