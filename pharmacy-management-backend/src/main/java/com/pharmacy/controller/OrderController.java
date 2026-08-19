package com.pharmacy.controller;

import com.pharmacy.dto.OrderResponse;
import com.pharmacy.entity.Order;
import com.pharmacy.entity.OrderStatus;
import com.pharmacy.entity.User;
import com.pharmacy.service.OrderService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    // =========================================================
    // GET CURRENT USER
    // =========================================================

    /*
     * Get the currently authenticated user
     * from Spring Security context.
     */
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        if (!(authentication.getPrincipal()
                instanceof User)) {

            throw new RuntimeException(
                    "Invalid authenticated user"
            );
        }

        return (User) authentication.getPrincipal();
    }


    // =========================================================
    // CREATE ORDER
    // =========================================================

    /*
     * POST /api/orders
     *
     * Current user's cart එක order එකකට convert කරනවා.
     *
     * Flow:
     *
     * Cart
     *   ↓
     * Check stock
     *   ↓
     * Create Order
     *   ↓
     * Create OrderItems
     *   ↓
     * Reduce stock
     *   ↓
     * Clear cart
     */
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder() {

        User user = getCurrentUser();

        Order order =
                orderService.createOrder(user);

        OrderResponse response =
                new OrderResponse(order);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // GET CURRENT USER ORDERS
    // =========================================================

    /*
     * GET /api/orders/my
     *
     * Logged-in customerගේ orders විතරක් ලබාගන්නවා.
     */
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {

        User user = getCurrentUser();

        List<Order> orders =
                orderService.getUserOrders(user);

        List<OrderResponse> responses =
                orders.stream()
                        .map(OrderResponse::new)
                        .toList();

        return ResponseEntity.ok(responses);
    }


    // =========================================================
    // GET ORDER BY ID
    // =========================================================

    /*
     * GET /api/orders/{id}
     *
     * Order ID එකෙන් order එක ලබාගන්නවා.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id
    ) {

        Order order =
                orderService.getOrderById(id);

        return ResponseEntity.ok(
                new OrderResponse(order)
        );
    }


    // =========================================================
    // GET ORDERS BY STATUS
    // =========================================================

    /*
     * GET /api/orders/status/{status}
     *
     * Example:
     *
     * GET /api/orders/status/PENDING
     * GET /api/orders/status/CONFIRMED
     * GET /api/orders/status/COMPLETED
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(
            @PathVariable OrderStatus status
    ) {

        List<Order> orders =
                orderService.getOrdersByStatus(status);

        List<OrderResponse> responses =
                orders.stream()
                        .map(OrderResponse::new)
                        .toList();

        return ResponseEntity.ok(responses);
    }


    // =========================================================
    // CANCEL ORDER
    // =========================================================

    /*
     * PUT /api/orders/{id}/cancel
     *
     * Customer තමන්ගේ order එක cancel කරනවා.
     *
     * Cancel වුණාම:
     *
     * Order status → CANCELLED
     *
     * Medicine stock → returned
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id
    ) {

        User user = getCurrentUser();

        Order order =
                orderService.cancelOrder(
                        id,
                        user
                );

        return ResponseEntity.ok(
                new OrderResponse(order)
        );
    }
}

