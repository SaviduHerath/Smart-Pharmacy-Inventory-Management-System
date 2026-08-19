package com.pharmacy.dto;

import com.pharmacy.entity.Order;
import com.pharmacy.entity.OrderItem;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long id;

    private Long userId;

    private String userName;

    private String userEmail;

    private BigDecimal totalAmount;

    private String status;

    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;


    // =========================================================
    // EMPTY CONSTRUCTOR
    // =========================================================

    public OrderResponse() {
    }


    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    public OrderResponse(Order order) {

        this.id =
                order.getId();

        this.userId =
                order.getUser().getId();

        this.userName =
                order.getUser().getFullName();

        this.userEmail =
                order.getUser().getEmail();

        this.totalAmount =
                order.getTotalAmount();

        this.status =
                order.getStatus().name();

        this.createdAt =
                order.getCreatedAt();


        /*
         * Convert OrderItem entities
         * into OrderItemResponse DTOs.
         */
        this.items =
                order.getItems()
                        .stream()
                        .map(OrderItemResponse::new)
                        .toList();
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(
            List<OrderItemResponse> items
    ) {
        this.items = items;
    }
}

