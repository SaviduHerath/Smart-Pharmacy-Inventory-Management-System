package com.pharmacy.dto;

import com.pharmacy.entity.OrderItem;

import java.math.BigDecimal;

public class OrderItemResponse {

    private Long id;

    private Long medicineId;

    private String medicineName;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal subtotal;


    // =========================================================
    // EMPTY CONSTRUCTOR
    // =========================================================

    public OrderItemResponse() {
    }


    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    public OrderItemResponse(OrderItem item) {

        this.id = item.getId();

        this.medicineId =
                item.getMedicine().getId();

        this.medicineName =
                item.getMedicine().getMedicineName();

        this.quantity =
                item.getQuantity();

        this.unitPrice =
                item.getUnitPrice();

        this.subtotal =
                item.getSubtotal();
    }


    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

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

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}

