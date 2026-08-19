package com.pharmacy.controller;

import com.pharmacy.dto.StockRequest;
import com.pharmacy.dto.StockResponse;
import com.pharmacy.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pharmacy.entity.TransactionType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService stockService;

    // Constructor injection.
    // Spring automatically provides StockService.
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    /**
     * Add or remove stock.
     *
     * POST /api/stock
     *
     * IN  -> increase medicine quantity
     * OUT -> decrease medicine quantity
     */
    @PostMapping
    public ResponseEntity<StockResponse> processStock(
            @Valid @RequestBody StockRequest request
    ) {

        // Send the request to the service layer.
        StockResponse response = stockService.processStock(request);

        // Return the created transaction.
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Get all stock transactions.
     *
     * GET /api/stock
     */
    @GetMapping
    public ResponseEntity<List<StockResponse>> getAllTransactions() {

        List<StockResponse> transactions =
                stockService.getAllTransactions();

        return ResponseEntity.ok(transactions);
    }

    /**
     * Get transaction history for a specific medicine.
     *
     * GET /api/stock/medicine/{medicineId}
     *
     * Example:
     * GET /api/stock/medicine/1
     */
    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<List<StockResponse>> getTransactionsByMedicine(
            @PathVariable Long medicineId
    ) {

        List<StockResponse> transactions =
                stockService.getTransactionsByMedicine(medicineId);

        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/out")
    public ResponseEntity<StockResponse> stockOut(
            @RequestBody StockRequest request
    ) {

        // Transaction type must be OUT
        request.setTransactionType(TransactionType.OUT);

        // StockService will:
        // 1. Find medicine
        // 2. Check available quantity
        // 3. Reduce quantity
        // 4. Save stock transaction
        return ResponseEntity.ok(
                stockService.processStock(request)
        );
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<StockResponse>> getTransactionsByType(
            @PathVariable TransactionType type
    ) {

        return ResponseEntity.ok(
                stockService.getTransactionsByType(type)
        );
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<StockResponse>> getTransactionsByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {

        LocalDateTime startDateTime =
                startDate.atStartOfDay();

        LocalDateTime endDateTime =
                endDate.atTime(23, 59, 59);

        return ResponseEntity.ok(
                stockService.getTransactionsByDateRange(
                        startDateTime,
                        endDateTime
                )
        );
    }
}