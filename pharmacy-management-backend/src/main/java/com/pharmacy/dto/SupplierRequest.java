package com.pharmacy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierRequest {

    // Supplier name is required
    @NotBlank(message = "Supplier name is required")
    private String name;

    // Email must have a valid email format
    @Email(message = "Invalid email format")
    private String email;

    // Supplier phone number
    private String phone;

    // Supplier address
    private String address;
}