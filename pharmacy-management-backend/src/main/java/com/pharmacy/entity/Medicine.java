package com.pharmacy.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "medicines")
public class Medicine {

    // Primary Key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Medicine name
    @Column(name = "medicine_name", nullable = false)
    private String medicineName;

    // Generic name of the medicine
    @Column(name = "generic_name")
    private String genericName;

    // Medicine category
    @Column(name = "category")
    private String category;

    // Supplier name
    @Column(name = "supplier")
    private String supplier;

    // Batch number
    @Column(name = "batch_number")
    private String batchNumber;

    // Available stock quantity
    @Column(name = "quantity", nullable = false)
    private Integer quantity = 0;

    // Price of one unit
    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    // Medicine expiry date
    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    // Minimum stock level before reorder
    @Column(name = "reorder_level")
    private Integer reorderLevel = 10;

    // Record created date
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Record updated date
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;




    // Empty constructor required by JPA
    public Medicine() {
    }


    // Automatically set dates before inserting
    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
    }


    // Automatically update updatedAt before updating
    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }


    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}