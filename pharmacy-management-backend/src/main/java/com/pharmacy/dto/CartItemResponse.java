package com.pharmacy.dto;

import com.pharmacy.entity.CartItem;

import java.math.BigDecimal;

public class CartItemResponse {

    private Long id;

    private Long medicineId;

    private String medicineName;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal subtotal;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public CartItemResponse() {
    }

    public CartItemResponse(CartItem item) {

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
                item.getUnitPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        item.getQuantity()
                                )
                        );
    }


    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public Long getMedicineId() {
        return medicineId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }
}