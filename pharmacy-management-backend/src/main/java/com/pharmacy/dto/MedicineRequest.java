package com.pharmacy.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MedicineRequest {

    // Medicine name entered by the user
    private String medicineName;

    // Generic name of the medicine
    private String genericName;

    // Medicine category
    private String category;

    // Supplier name
    private String supplier;

    // Batch number
    private String batchNumber;

    // Initial stock quantity
    private Integer quantity;

    // Price of one medicine unit
    private BigDecimal unitPrice;

    // Expiry date
    private LocalDate expiryDate;

    // Minimum stock level
    private Integer reorderLevel;




    // Empty constructor
    public MedicineRequest() {
    }


    // Getters and Setters

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }
}