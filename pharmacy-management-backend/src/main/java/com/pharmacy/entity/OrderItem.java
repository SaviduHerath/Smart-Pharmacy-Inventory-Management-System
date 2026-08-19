package com.pharmacy.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // ORDER
    // =========================================================

    /*
     * This OrderItem belongs to one Order.
     *
     * Example:
     *
     * Order #1
     *   ├── OrderItem #1
     *   ├── OrderItem #2
     *   └── OrderItem #3
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;


    // =========================================================
    // MEDICINE
    // =========================================================

    /*
     * Medicine included in this order.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;


    // =========================================================
    // QUANTITY
    // =========================================================

    /*
     * Number of units purchased.
     *
     * Example:
     * Panadol × 5
     */
    @Column(nullable = false)
    private Integer quantity;


    // =========================================================
    // UNIT PRICE
    // =========================================================

    /*
     * Medicine price at the time of purchase.
     *
     * We store this separately instead of always
     * reading Medicine.unitPrice.
     *
     * This is important because medicine price
     * may change in the future.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;


    // =========================================================
    // SUBTOTAL
    // =========================================================

    /*
     * quantity × unitPrice
     *
     * Example:
     *
     * quantity = 5
     * unitPrice = 100
     *
     * subtotal = 500
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;


    // =========================================================
    // CONSTRUCTORS
    // =========================================================

    public OrderItem() {
    }

    public OrderItem(
            Order order,
            Medicine medicine,
            Integer quantity,
            BigDecimal unitPrice
    ) {
        this.order = order;
        this.medicine = medicine;
        this.quantity = quantity;
        this.unitPrice = unitPrice;

        // Calculate subtotal automatically.
        this.subtotal =
                unitPrice.multiply(
                        BigDecimal.valueOf(quantity)
                );
    }


    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
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

        // Recalculate subtotal when quantity changes.
        if (this.unitPrice != null && quantity != null) {
            this.subtotal =
                    this.unitPrice.multiply(
                            BigDecimal.valueOf(quantity)
                    );
        }
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {

        this.unitPrice = unitPrice;

        // Recalculate subtotal when price changes.
        if (this.unitPrice != null && this.quantity != null) {
            this.subtotal =
                    this.unitPrice.multiply(
                            BigDecimal.valueOf(this.quantity)
                    );
        }
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}

