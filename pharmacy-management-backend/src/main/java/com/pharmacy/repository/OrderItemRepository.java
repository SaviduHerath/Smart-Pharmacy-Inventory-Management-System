package com.pharmacy.repository;

import com.pharmacy.entity.Order;
import com.pharmacy.entity.OrderItem;
import com.pharmacy.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {

    // Get all items belonging to an order
    List<OrderItem> findByOrder(Order order);

    // Get all order items containing a specific medicine
    List<OrderItem> findByMedicine(Medicine medicine);

    // Get order items for a specific order and medicine
    OrderItem findByOrderAndMedicine(
            Order order,
            Medicine medicine
    );
}
