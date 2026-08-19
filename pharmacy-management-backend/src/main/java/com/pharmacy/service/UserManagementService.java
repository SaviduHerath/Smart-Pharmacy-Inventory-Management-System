package com.pharmacy.service;

import com.pharmacy.dto.AdminUserRequest;
import com.pharmacy.dto.AdminUserResponse;
import com.pharmacy.entity.User;
import com.pharmacy.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserManagementService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserManagementService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // CREATE ADMIN / PHARMACIST
    // =========================================================

    public AdminUserResponse createStaffUser(
            AdminUserRequest request
    ) {

        // Check email
        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Only ADMIN and PHARMACIST allowed
        String role = request.getRole().toUpperCase();

        if (!role.equals("ADMIN") &&
                !role.equals("PHARMACIST")) {

            throw new RuntimeException(
                    "Only ADMIN or PHARMACIST roles are allowed"
            );
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // Password hash
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(role);

        User savedUser =
                userRepository.save(user);

        return convertToResponse(savedUser);
    }

    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private AdminUserResponse convertToResponse(User user) {

        return new AdminUserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
}