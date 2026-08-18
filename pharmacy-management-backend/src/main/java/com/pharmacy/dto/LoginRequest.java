package com.pharmacy.dto;

public class LoginRequest {

    // User login කරන email එක.
    private String email;

    // User enter කරන password එක.
    private String password;

    public LoginRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}