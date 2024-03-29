package com.isi.tracking.services.impl;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.isi.tracking.models.Token;
import com.isi.tracking.models.User;
import com.isi.tracking.services.AuthService;
import com.isi.tracking.utils.JwtTokenUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.concurrent.ExecutionException;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;
    private final String COLLECTION = "users";

    @Override
    public void register(User user) throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = firestore.collection(COLLECTION).document(user.getEmail());
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    String.format("Username already exists: %s", user.getEmail()));
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            firestore.collection(COLLECTION)
                    .document(user.getEmail())
                    .set(user);
        }
    }

    @Override
    public Token login(User user) throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = firestore.collection(COLLECTION).document(user.getEmail());
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        User databaseUser = future.get().toObject(User.class);
        if (databaseUser == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("User doesn't exist: %s", user.getEmail()));
        }
        if (!user.getEmail().equals(databaseUser.getEmail())
                || !passwordEncoder.matches(user.getPassword(), databaseUser.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid credentials");
        }
        return new Token(jwtTokenUtil.generateToken(databaseUser.getEmail()));
    }

    @Override
    public String getCurrentUsername() {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user.getEmail();
    }


}
