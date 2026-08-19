package com.pharmacy.controller;

import com.pharmacy.dto.AdminUserRequest;
import com.pharmacy.dto.AdminUserResponse;
import com.pharmacy.service.UserManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class UserManagementController {

    private final UserManagementService userManagementService;

    public UserManagementController(
            UserManagementService userManagementService
    ) {
        this.userManagementService = userManagementService;
    }

    // =========================================================
    // GET ALL USERS
    // ADMIN ONLY
    // =========================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                userManagementService.getAllUsers()
        );
    }

    // =========================================================
    // CREATE ADMIN / PHARMACIST
    // ADMIN ONLY
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserResponse> createStaffUser(
            @Valid @RequestBody AdminUserRequest request
    ) {

        AdminUserResponse response =
                userManagementService.createStaffUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}