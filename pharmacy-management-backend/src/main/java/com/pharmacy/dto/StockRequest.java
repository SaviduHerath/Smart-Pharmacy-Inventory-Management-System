package com.pharmacy.dto;

import com.pharmacy.entity.TransactionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StockRequest {

    // Medicine ID that we want to update.
    // Example: medicineId = 1 means Paracetamol with ID 1.
    @NotNull(message = "Medicine ID is required")
    private Long medicineId;

    // Type of stock movement.
    // IN  -> Add stock
    // OUT -> Remove stock
    @NotNull(message = "Transaction type is required")
    private TransactionType transactionType;

    // Number of medicine units being added or removed.
    // Quantity must be at least 1.
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    // Reason for this stock movement.
    // Example: "New Supplier Stock", "Sale", "Damaged"
    private String reason;

    // Empty constructor required by Jackson
    // when converting JSON request → Java object.
    public StockRequest() {
    }

    public Long getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}