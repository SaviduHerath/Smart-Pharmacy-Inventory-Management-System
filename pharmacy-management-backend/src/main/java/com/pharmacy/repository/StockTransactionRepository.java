package com.pharmacy.repository;

import com.pharmacy.entity.Medicine;
import com.pharmacy.entity.StockTransaction;
import com.pharmacy.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockTransactionRepository
        extends JpaRepository<StockTransaction, Long> {

    // Get all stock transactions belonging to a specific medicine.
    // Example:
    // Paracetamol -> IN 100, OUT 10, IN 50...
    List<StockTransaction> findByMedicine(Medicine medicine);

    // Get transactions by medicine and transaction type.
    // Example:
    // All IN transactions for Paracetamol.
    List<StockTransaction> findByMedicineAndTransactionType(
            Medicine medicine,
            TransactionType transactionType
    );
}