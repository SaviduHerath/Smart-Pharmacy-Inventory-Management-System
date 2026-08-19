package com.pharmacy.repository;

import com.pharmacy.entity.Cart;
import com.pharmacy.entity.CartItem;
import com.pharmacy.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    // Get all items belonging to a cart
    List<CartItem> findByCart(Cart cart);

    // Find a specific medicine inside a cart
    Optional<CartItem> findByCartAndMedicine(
            Cart cart,
            Medicine medicine
    );

    // Delete all items belonging to a cart
    void deleteByCart(Cart cart);
}