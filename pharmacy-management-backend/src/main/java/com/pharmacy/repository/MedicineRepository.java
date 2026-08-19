package com.pharmacy.repository;

import com.pharmacy.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByQuantity(Integer quantity);

    @Query("SELECT m FROM Medicine m WHERE m.quantity <= m.reorderLevel")
    List<Medicine> findLowStockMedicines();

    @Query("SELECT m FROM Medicine m WHERE m.expiryDate < CURRENT_DATE")
    List<Medicine> findExpiredMedicines();

    List<Medicine> findByExpiryDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
    SELECT m FROM Medicine m
    WHERE LOWER(m.medicineName) LIKE LOWER(CONCAT('%', :keyword, '%'))
       OR LOWER(m.genericName) LIKE LOWER(CONCAT('%', :keyword, '%'))
       OR LOWER(m.category) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    List<Medicine> searchMedicines(@Param("keyword") String keyword);

    List<Medicine> findByCategoryIgnoreCase(String category);
}