package com.isi.tracking.controllers;

import com.isi.tracking.models.Token;
import com.isi.tracking.models.User;
import com.isi.tracking.services.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("api/auth")
@AllArgsConstructor
@CrossOrigin("http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    @PostMapping("register")
    ResponseEntity<Void> register(@RequestBody User user) throws ExecutionException, InterruptedException {
        authService.register(user);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("login")
    ResponseEntity<Token> login(@RequestBody User user) throws ExecutionException, InterruptedException {
        Token token = authService.login(user);
        return ResponseEntity.ok().body(token);
    }
}
