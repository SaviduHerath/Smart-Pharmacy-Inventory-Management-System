package com.pharmacy.repository;

import com.pharmacy.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    // Find medicines that have zero quantity.
    // Example:
    // quantity = 0
    //
    // These medicines are Out of Stock.
    List<Medicine> findByQuantity(Integer quantity);


    // Find medicines where current quantity
    // is less than or equal to their reorder level.
    //
    // Example:
    // quantity = 5
    // reorderLevel = 10
    //
    // 5 <= 10 → Low Stock
    @Query("""
            SELECT m
            FROM Medicine m
            WHERE m.quantity <= m.reorderLevel
            AND m.quantity > 0
            """)
    List<Medicine> findLowStockMedicines();

}