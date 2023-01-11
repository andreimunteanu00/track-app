package com.isi.tracking.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Bean
    void getFirebase() throws IOException {

        logger.info("Initializing Firebase client...");
        FileInputStream serviceAccount =
                new FileInputStream("src/main/resources/static/fir-for-isi-project-firebase-adminsdk-81c3a-8aba009bc6.json");

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl("https://fir-for-isi-project-default-rtdb.europe-west1.firebasedatabase.app")
                .build();

        FirebaseApp.initializeApp(options);
        logger.info("Firebase client successfully started!");
    }
}
