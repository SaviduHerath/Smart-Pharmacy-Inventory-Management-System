package com.pharmacy.repository;

import com.pharmacy.entity.Order;
import com.pharmacy.entity.OrderStatus;
import com.pharmacy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Get all orders belonging to a specific customer
    List<Order> findByUser(User user);

    // Get orders by their status
    List<Order> findByStatus(OrderStatus status);

    // Get orders belonging to a customer with a specific status
    List<Order> findByUserAndStatus(
            User user,
            OrderStatus status
    );
}

