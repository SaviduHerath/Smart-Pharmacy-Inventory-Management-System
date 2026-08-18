package com.pharmacy.dto;

import com.pharmacy.entity.StockTransaction;
import com.pharmacy.entity.TransactionType;

import java.time.LocalDateTime;

public class StockResponse {

    // Stock transaction ID
    private Long id;

    // Medicine ID
    private Long medicineId;

    // Medicine name
    private String medicineName;

    // IN or OUT
    private TransactionType transactionType;

    // Number of units
    private Integer quantity;

    // Reason for the transaction
    private String reason;

    // Transaction creation date and time
    private LocalDateTime createdAt;

    // Empty constructor
    public StockResponse() {
    }

    // Constructor used to convert Entity → DTO
    public StockResponse(StockTransaction transaction) {

        this.id = transaction.getId();

        // Get the medicine ID from the related Medicine entity
        this.medicineId = transaction.getMedicine().getId();

        // Get the medicine name from the related Medicine entity
        this.medicineName = transaction.getMedicine().getMedicineName();

        this.transactionType = transaction.getTransactionType();

        this.quantity = transaction.getQuantity();

        this.reason = transaction.getReason();

        this.createdAt = transaction.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}