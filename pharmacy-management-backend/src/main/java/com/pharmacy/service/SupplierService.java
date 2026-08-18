package com.pharmacy.service;

import com.pharmacy.dto.SupplierRequest;
import com.pharmacy.dto.SupplierResponse;
import com.pharmacy.entity.Supplier;
import com.pharmacy.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    // Constructor injection.
    // Spring automatically provides SupplierRepository.
    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // =========================================================
    // CREATE SUPPLIER
    // =========================================================

    public SupplierResponse createSupplier(SupplierRequest request) {

        // Check whether a supplier with this email already exists.
        if (request.getEmail() != null &&
                !request.getEmail().isBlank() &&
                supplierRepository.findByEmail(request.getEmail()).isPresent()) {

            throw new RuntimeException("Supplier with this email already exists");
        }

        // Convert DTO → Entity
        Supplier supplier = new Supplier();

        supplier.setName(request.getName());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
        supplier.setAddress(request.getAddress());

        // New supplier is active by default.
        supplier.setActive(true);

        // Save supplier to database.
        Supplier savedSupplier = supplierRepository.save(supplier);

        // Convert Entity → Response DTO
        return toResponse(savedSupplier);
    }

    // =========================================================
    // GET ALL SUPPLIERS
    // =========================================================

    public List<SupplierResponse> getAllSuppliers() {

        return supplierRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================================================
    // GET ACTIVE SUPPLIERS
    // =========================================================

    public List<SupplierResponse> getActiveSuppliers() {

        return supplierRepository.findByActiveTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================================================
    // GET SUPPLIER BY ID
    // =========================================================

    public SupplierResponse getSupplierById(Long id) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found with id: " + id));

        return toResponse(supplier);
    }

    // =========================================================
    // UPDATE SUPPLIER
    // =========================================================

    public SupplierResponse updateSupplier(
            Long id,
            SupplierRequest request
    ) {

        // Find existing supplier.
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found with id: " + id));

        // Update fields.
        supplier.setName(request.getName());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
        supplier.setAddress(request.getAddress());

        // Save updated supplier.
        Supplier updatedSupplier = supplierRepository.save(supplier);

        return toResponse(updatedSupplier);
    }

    // =========================================================
    // DELETE SUPPLIER
    // =========================================================

    public void deleteSupplier(Long id) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found with id: " + id));

        /*
         * We don't physically delete the supplier.
         *
         * Instead:
         * active = false
         *
         * This is called a soft delete.
         *
         * It keeps historical supplier information in the database.
         */
        supplier.setActive(false);

        supplierRepository.save(supplier);
    }

    // =========================================================
    // ENTITY → RESPONSE DTO
    // =========================================================

    private SupplierResponse toResponse(Supplier supplier) {

        return new SupplierResponse(
                supplier.getId(),
                supplier.getName(),
                supplier.getEmail(),
                supplier.getPhone(),
                supplier.getAddress(),
                supplier.isActive()
        );
    }
}