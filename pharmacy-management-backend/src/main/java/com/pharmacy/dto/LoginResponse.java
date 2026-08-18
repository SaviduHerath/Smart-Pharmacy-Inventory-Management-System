package com.pharmacy.dto;

public class LoginResponse {

    // Frontend එකට යවන JWT token එක.
    private String token;

    // Logged-in user's ID.
    private Long userId;

    // Logged-in user's name.
    private String fullName;

    // Logged-in user's email.
    private String email;

    // User role.
    private String role;

    public LoginResponse(
            String token,
            Long userId,
            String fullName,
            String email,
            String role
    ) {
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}