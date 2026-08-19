package com.pharmacy.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which cart this item belongs to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    // Medicine added to cart
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    // Quantity selected by customer
    @Column(nullable = false)
    private Integer quantity;

    // Price at the time item was added
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;


    // =========================================================
    // CONSTRUCTORS
    // =========================================================

    public CartItem() {
    }

    public CartItem(
            Cart cart,
            Medicine medicine,
            Integer quantity,
            BigDecimal unitPrice
    ) {
        this.cart = cart;
        this.medicine = medicine;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }


    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Medicine getMedicine() {
        return medicine;
    }

    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
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
}