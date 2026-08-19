package com.pharmacy.repository;

import com.pharmacy.entity.Cart;
import com.pharmacy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    // Find cart belonging to a specific user
    Optional<Cart> findByUser(User user);
}