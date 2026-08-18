package com.pharmacy.controller;

import com.pharmacy.dto.SupplierRequest;
import com.pharmacy.dto.SupplierResponse;
import com.pharmacy.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

// All Supplier APIs will start with /api/suppliers
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    // Constructor injection.
    // Spring automatically gives us SupplierService.
    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // =========================================================
    // CREATE SUPPLIER
    // POST /api/suppliers
    // =========================================================

    @PostMapping
    public ResponseEntity<SupplierResponse> createSupplier(
            @Valid @RequestBody SupplierRequest request
    ) {

        SupplierResponse response =
                supplierService.createSupplier(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================================================
    // GET ALL SUPPLIERS
    // GET /api/suppliers
    // =========================================================

    @GetMapping
    public ResponseEntity<List<SupplierResponse>> getAllSuppliers() {

        return ResponseEntity.ok(
                supplierService.getAllSuppliers()
        );
    }

    // =========================================================
    // GET ACTIVE SUPPLIERS
    // GET /api/suppliers/active
    // =========================================================

    @GetMapping("/active")
    public ResponseEntity<List<SupplierResponse>> getActiveSuppliers() {

        return ResponseEntity.ok(
                supplierService.getActiveSuppliers()
        );
    }

    // =========================================================
    // GET SUPPLIER BY ID
    // GET /api/suppliers/{id}
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponse> getSupplierById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                supplierService.getSupplierById(id)
        );
    }

    // =========================================================
    // UPDATE SUPPLIER
    // PUT /api/suppliers/{id}
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponse> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody SupplierRequest request
    ) {

        return ResponseEntity.ok(
                supplierService.updateSupplier(id, request)
        );
    }

    // =========================================================
    // DELETE / DEACTIVATE SUPPLIER
    // DELETE /api/suppliers/{id}
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(
            @PathVariable Long id
    ) {

        supplierService.deleteSupplier(id);

        return ResponseEntity.noContent().build();
    }
}