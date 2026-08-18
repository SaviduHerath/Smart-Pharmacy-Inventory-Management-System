package com.pharmacy.controller;

import com.pharmacy.dto.LoginRequest;
import com.pharmacy.dto.LoginResponse;
import com.pharmacy.entity.User;
import com.pharmacy.service.AuthService;
import com.pharmacy.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;

    private final AuthService authService;

    public AuthController(
            UserService userService,
            AuthService authService
    ) {
        this.userService = userService;
        this.authService = authService;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user
    ) {

        try {

            // Registration business logic එක UserService එකට යවනවා.
            User savedUser =
                    userService.registerUser(user);

            // Password එක response එකට යවන්නේ නැහැ.
            savedUser.setPassword(null);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        try {

            // Login logic එක AuthService එකට යවනවා.
            LoginResponse response =
                    authService.login(request);

            // Login success.
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            // Login failed.
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
}