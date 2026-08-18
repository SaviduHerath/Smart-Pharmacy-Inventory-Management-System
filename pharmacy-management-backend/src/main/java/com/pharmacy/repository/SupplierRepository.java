package com.pharmacy.repository;

import com.pharmacy.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    // Find a supplier by email.
    // Optional is used because the supplier may not exist.
    Optional<Supplier> findByEmail(String email);

    // Get only active suppliers.
    List<Supplier> findByActiveTrue();
}