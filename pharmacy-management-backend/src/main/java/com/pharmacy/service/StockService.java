package com.pharmacy.service;

import com.pharmacy.dto.StockRequest;
import com.pharmacy.dto.StockResponse;
import com.pharmacy.entity.Medicine;
import com.pharmacy.entity.StockTransaction;
import com.pharmacy.entity.TransactionType;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pharmacy.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockService {

    private final MedicineRepository medicineRepository;
    private final StockTransactionRepository stockTransactionRepository;

    // Constructor injection.
    // Spring automatically injects the required repositories.
    public StockService(
            MedicineRepository medicineRepository,
            StockTransactionRepository stockTransactionRepository
    ) {
        this.medicineRepository = medicineRepository;
        this.stockTransactionRepository = stockTransactionRepository;
    }

    /**
     * Add or remove medicine stock.
     *
     * IN:
     *     Current quantity + requested quantity
     *
     * OUT:
     *     Current quantity - requested quantity
     *
     * After changing the medicine quantity,
     * a StockTransaction record is created.
     */
    @Transactional
    public StockResponse processStock(StockRequest request) {

        // Find the medicine using the ID sent by the frontend/Postman.
        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medicine not found with ID: "
                                        + request.getMedicineId()
                        )
                );

        // Get current stock quantity.
        int currentQuantity = medicine.getQuantity();

        // Get requested stock quantity.
        int requestedQuantity = request.getQuantity();

        /*
         * If transaction type is IN,
         * we are adding stock to the pharmacy.
         *
         * Example:
         * Current stock = 100
         * IN = 50
         * New stock = 150
         */
        if (request.getTransactionType()== TransactionType.IN) {

            medicine.setQuantity(
                    medicine.getQuantity() + request.getQuantity()
            );

        } else if (request.getTransactionType()== TransactionType.OUT) {

            if (medicine.getQuantity() < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock");
            }

            medicine.setQuantity(
                    medicine.getQuantity() - request.getQuantity()
            );
        }

        /*
         * Save the updated medicine quantity.
         *
         * Because this method is @Transactional,
         * the database changes are handled as one transaction.
         */
        medicineRepository.save(medicine);



        // Create stock transaction
        StockTransaction transaction = new StockTransaction(
                medicine,
                request.getTransactionType(),
                requestedQuantity,
                request.getReason()
        );

// Get currently logged-in user
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User user = null;

        if (authentication != null &&
                authentication.isAuthenticated() &&
                authentication.getPrincipal() instanceof User) {

            user = (User) authentication.getPrincipal();
        }

// Link transaction with logged-in user
        transaction.setUser(user);

// Save transaction
        StockTransaction savedTransaction =
                stockTransactionRepository.save(transaction);

        return new StockResponse(savedTransaction);
    }

    /**
     * Get all stock transaction history.
     */
    public List<StockResponse> getAllTransactions() {

        return stockTransactionRepository.findAll()
                .stream()
                .map(StockResponse::new)
                .toList();
    }

    /**
     * Get stock transaction history for one medicine.
     */
    public List<StockResponse> getTransactionsByMedicine(Long medicineId) {

        // Find the medicine first.
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medicine not found with ID: " + medicineId
                        )
                );

        // Get transactions belonging to this medicine.
        return stockTransactionRepository
                .findByMedicine(medicine)
                .stream()
                .map(StockResponse::new)
                .toList();
    }

    public List<StockResponse> getTransactionsByType(
            TransactionType transactionType
    ) {

        return stockTransactionRepository
                .findByTransactionType(transactionType)
                .stream()
                .map(StockResponse::new)
                .toList();
    }

    public List<StockResponse> getTransactionsByDateRange(
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {

        return stockTransactionRepository
                .findByCreatedAtBetween(startDate, endDate)
                .stream()
                .map(StockResponse::new)
                .toList();
    }
}