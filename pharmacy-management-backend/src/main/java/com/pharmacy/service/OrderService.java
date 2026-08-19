package com.pharmacy.service;

import com.pharmacy.entity.Cart;
import com.pharmacy.entity.CartItem;
import com.pharmacy.entity.Medicine;
import com.pharmacy.entity.Order;
import com.pharmacy.entity.OrderItem;
import com.pharmacy.entity.OrderStatus;
import com.pharmacy.entity.User;
import com.pharmacy.repository.CartItemRepository;
import com.pharmacy.repository.CartRepository;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.OrderItemRepository;
import com.pharmacy.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MedicineRepository medicineRepository;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            MedicineRepository medicineRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.medicineRepository = medicineRepository;
    }


    // =========================================================
    // CREATE ORDER FROM CART
    // =========================================================

    @Transactional
    public Order createOrder(User user) {

        /*
         * Find customer's cart.
         */
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart not found"
                        )
                );


        /*
         * Get all cart items.
         */
        List<CartItem> cartItems =
                cartItemRepository.findByCart(cart);


        /*
         * Customer cannot place an empty cart.
         */
        if (cartItems.isEmpty()) {

            throw new RuntimeException(
                    "Cannot create order from an empty cart"
            );
        }


        // =====================================================
        // STEP 1 — CHECK STOCK
        // =====================================================

        /*
         * Check every medicine before changing
         * any stock quantity.
         */
        for (CartItem cartItem : cartItems) {

            Medicine medicine =
                    cartItem.getMedicine();

            if (medicine.getQuantity()
                    < cartItem.getQuantity()) {

                throw new RuntimeException(
                        "Insufficient stock for medicine: "
                                + medicine.getMedicineName()
                                + ". Available: "
                                + medicine.getQuantity()
                );
            }
        }


        // =====================================================
        // STEP 2 — CALCULATE TOTAL
        // =====================================================

        BigDecimal totalAmount =
                BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {

            BigDecimal itemTotal =
                    cartItem.getUnitPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            cartItem.getQuantity()
                                    )
                            );

            totalAmount =
                    totalAmount.add(itemTotal);
        }


        // =====================================================
        // STEP 3 — CREATE ORDER
        // =====================================================

        Order order =
                new Order(
                        user,
                        totalAmount,
                        OrderStatus.PENDING
                );

        Order savedOrder =
                orderRepository.save(order);


        // =====================================================
        // STEP 4 — CREATE ORDER ITEMS
        // =====================================================

        for (CartItem cartItem : cartItems) {

            Medicine medicine =
                    cartItem.getMedicine();

            OrderItem orderItem =
                    new OrderItem(
                            savedOrder,
                            medicine,
                            cartItem.getQuantity(),
                            cartItem.getUnitPrice()
                    );

            orderItemRepository.save(orderItem);
        }


        // =====================================================
        // STEP 5 — REDUCE MEDICINE STOCK
        // =====================================================

        for (CartItem cartItem : cartItems) {

            Medicine medicine =
                    cartItem.getMedicine();

            medicine.setQuantity(
                    medicine.getQuantity()
                            - cartItem.getQuantity()
            );

            medicineRepository.save(medicine);
        }


        // =====================================================
        // STEP 6 — CLEAR CART
        // =====================================================

        cartItemRepository.deleteByCart(cart);


        // =====================================================
        // RETURN ORDER
        // =====================================================

        return savedOrder;
    }


    // =========================================================
    // GET ORDER BY ID
    // =========================================================

    public Order getOrderById(Long orderId) {

        return orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found with id: "
                                        + orderId
                        )
                );
    }


    // =========================================================
    // GET CURRENT USER ORDERS
    // =========================================================

    public List<Order> getUserOrders(User user) {

        return orderRepository.findByUser(user);
    }


    // =========================================================
    // GET ORDERS BY STATUS
    // =========================================================

    public List<Order> getOrdersByStatus(
            OrderStatus status
    ) {

        return orderRepository.findByStatus(status);
    }


    // =========================================================
    // CANCEL ORDER
    // =========================================================

    @Transactional
    public Order cancelOrder(
            Long orderId,
            User user
    ) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with id: "
                                                + orderId
                                )
                        );


        /*
         * Customer can only cancel
         * their own order.
         */
        if (!order.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You cannot cancel this order"
            );
        }


        /*
         * Completed or already cancelled orders
         * cannot be cancelled.
         */
        if (order.getStatus()
                == OrderStatus.COMPLETED) {

            throw new RuntimeException(
                    "Completed order cannot be cancelled"
            );
        }

        if (order.getStatus()
                == OrderStatus.CANCELLED) {

            throw new RuntimeException(
                    "Order is already cancelled"
            );
        }


        /*
         * Get order items so that the stock can
         * be returned to the medicine inventory.
         */
        List<OrderItem> orderItems =
                orderItemRepository.findByOrder(order);


        /*
         * Return quantities to stock.
         *
         * Example:
         *
         * Current stock = 8
         * Ordered = 2
         *
         * Cancel order
         *
         * New stock = 10
         */
        for (OrderItem orderItem : orderItems) {

            Medicine medicine =
                    orderItem.getMedicine();

            medicine.setQuantity(
                    medicine.getQuantity()
                            + orderItem.getQuantity()
            );

            medicineRepository.save(medicine);
        }


        /*
         * Change order status.
         */
        order.setStatus(
                OrderStatus.CANCELLED
        );


        return orderRepository.save(order);
    }
}

