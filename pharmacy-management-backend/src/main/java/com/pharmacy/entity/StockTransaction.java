package com.pharmacy.entity;

import com.pharmacy.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_transactions")
public class StockTransaction {

    // Primary key of the stock transaction
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Medicine related to this stock transaction
    // Many stock transactions can belong to one medicine
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    // IN  = Stock added to pharmacy
    // OUT = Stock removed from pharmacy
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    // Number of medicine units added or removed
    @Column(nullable = false)
    private Integer quantity;

    // Reason for the stock movement
    // Example: "New Supplier Stock", "Sale", "Damaged"
    @Column(length = 255)
    private String reason;

    // Date and time when the transaction was created
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Empty constructor required by JPA
    public StockTransaction() {
    }

    // Constructor for creating a stock transaction
    public StockTransaction(
            Medicine medicine,
            TransactionType transactionType,
            Integer quantity,
            String reason
    ) {
        this.medicine = medicine;
        this.transactionType = transactionType;
        this.quantity = quantity;
        this.reason = reason;
    }

    // Automatically set creation time before saving
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Medicine getMedicine() {
        return medicine;
    }

    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}