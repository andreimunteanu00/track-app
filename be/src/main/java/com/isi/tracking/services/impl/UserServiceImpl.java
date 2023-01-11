package com.isi.tracking.services.impl;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.auth.hash.Bcrypt;
import com.google.firebase.cloud.FirestoreClient;
import com.isi.tracking.models.User;
import com.isi.tracking.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

public class UserServiceImpl implements UserService {

    private final String COLLECTION = "users";

    @Override
    public User getUserById(String id) {
        try {
            Firestore firestore = FirestoreClient.getFirestore();
            DocumentReference documentReference = firestore.collection(COLLECTION).document(id);
            ApiFuture<DocumentSnapshot> future = documentReference.get();

            DocumentSnapshot documentSnapshot = future.get();

            if (documentSnapshot.exists()) {
                return documentSnapshot.toObject(User.class);
            } else {
                return null;
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    String.format("Getting user by id: %s failed with exception:\n%s", id, e.getMessage()));
        }
    }

    @Override
    public User storeUser(User user) {
        try {
            Firestore firestore = FirestoreClient.getFirestore();
            user.setId(UUID.randomUUID().toString());

            ApiFuture<WriteResult> collectionsApiFuture = firestore
                    .collection(COLLECTION)
                    .document(user.getId())
                    .set(user);

            return user;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    String.format("Storing shipment failed with exception:\n%s", e.getMessage()));
        }
    }

    @Override
    public User updateUser(User user) {
        return null;
    }

    @Override
    public void deleteUser(Integer id) {

    }
}
