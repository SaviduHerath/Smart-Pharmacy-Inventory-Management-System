package com.pharmacy.repository;

import com.pharmacy.entity.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByQuantity(Integer quantity);

    @Query("""
        SELECT m
        FROM Medicine m
        WHERE m.quantity <= m.reorderLevel
    """)
    List<Medicine> findLowStockMedicines();

    @Query("""
        SELECT m
        FROM Medicine m
        WHERE m.expiryDate < CURRENT_DATE
    """)
    List<Medicine> findExpiredMedicines();

    List<Medicine> findByExpiryDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
        SELECT m
        FROM Medicine m
        WHERE LOWER(m.medicineName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(m.genericName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(m.category) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    List<Medicine> searchMedicines(
            @Param("keyword") String keyword
    );

    List<Medicine> findByCategoryIgnoreCase(String category);


    // =========================================================
    // SERVER-SIDE SEARCH + FILTER + PAGINATION
    // =========================================================

    
    @Query("""
        SELECT m
        FROM Medicine m
        WHERE
            (
                :keyword = ''
                OR LOWER(m.medicineName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(m.genericName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(m.category) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(m.supplier) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(m.batchNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
        AND
            (
                :filter = 'ALL'

                OR (
                    :filter = 'LOW_STOCK'
                    AND m.quantity <= m.reorderLevel
                    AND m.quantity > 0
                )

                OR (
                    :filter = 'OUT_OF_STOCK'
                    AND m.quantity = 0
                )

                OR (
                    :filter = 'EXPIRED'
                    AND m.expiryDate < CURRENT_DATE
                )

                OR (
                    :filter = 'NEAR_EXPIRY'
                    AND m.expiryDate >= CURRENT_DATE
                    AND m.expiryDate <= :nearExpiryDate
                )
            )
    """)
    Page<Medicine> findMedicinesWithFilter(
            @Param("keyword") String keyword,
            @Param("filter") String filter,
            @Param("nearExpiryDate") LocalDate nearExpiryDate,
            Pageable pageable
    );

    
}