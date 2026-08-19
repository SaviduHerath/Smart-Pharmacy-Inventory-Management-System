package com.pharmacy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartRequest {

    // Medicine that customer wants to add
    @NotNull(message = "Medicine ID is required")
    private Long medicineId;

    // Quantity customer wants
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;


    // =========================================================
    // CONSTRUCTORS
    // =========================================================

    public CartRequest() {
    }

    public CartRequest(Long medicineId, Integer quantity) {
        this.medicineId = medicineId;
        this.quantity = quantity;
    }


    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}