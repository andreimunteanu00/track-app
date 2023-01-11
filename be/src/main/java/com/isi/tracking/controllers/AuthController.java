package com.isi.tracking.controllers;

import com.isi.tracking.models.User;
import com.isi.tracking.services.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("register")
    ResponseEntity<Void> register(@RequestBody User user) throws ExecutionException, InterruptedException {
        authService.register(user);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("login")
    ResponseEntity<Void> login(@RequestBody User user) throws ExecutionException, InterruptedException {
        authService.login(user);
        return ResponseEntity.accepted().build();
    }
}
