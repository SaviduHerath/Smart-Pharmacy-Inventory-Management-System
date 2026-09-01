package com.pharmacy.service;

import com.pharmacy.dto.MedicineRequest;
import com.pharmacy.dto.MedicineResponse;
import com.pharmacy.entity.Medicine;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.SupplierRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDate;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    private final SupplierRepository supplierRepository;
    // Repository එක Service එකට inject කරනවා
    public MedicineService(
            MedicineRepository medicineRepository,
            SupplierRepository supplierRepository
    ) {
        this.medicineRepository = medicineRepository;
        this.supplierRepository = supplierRepository;
    }


    // =========================================================
    // CREATE MEDICINE
    // =========================================================

    public MedicineResponse createMedicine(MedicineRequest request) {

        // Request DTO එකෙන් data අරගෙන Entity එකක් හදනවා
        Medicine medicine = new Medicine();



        medicine.setMedicineName(request.getMedicineName());
        medicine.setGenericName(request.getGenericName());
        medicine.setCategory(request.getCategory());
        medicine.setSupplier(request.getSupplier());
        medicine.setBatchNumber(request.getBatchNumber());
        medicine.setQuantity(request.getQuantity());
        medicine.setUnitPrice(request.getUnitPrice());
        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setReorderLevel(request.getReorderLevel());

        // Check whether the selected supplier exists.
        if (request.getSupplier() != null &&
                !request.getSupplier().isBlank()) {

            supplierRepository.findByName(request.getSupplier())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Supplier not found: " + request.getSupplier()
                            )
                    );
        }


        // Entity එක database එකට save කරනවා
        Medicine savedMedicine = medicineRepository.save(medicine);

        // Saved Entity එක Response DTO එකකට convert කරනවා
        return convertToResponse(savedMedicine);
    }


    // =========================================================
    // GET ALL MEDICINES
    // =========================================================

    public List<MedicineResponse> getAllMedicines() {

        // Database එකෙන් සියලු medicines ලබාගන්නවා
        List<Medicine> medicines = medicineRepository.findAll();

        // Entity list එක Response DTO list එකකට convert කරනවා
        return medicines.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get all medicines that are currently low in stock.
//
// A medicine is considered LOW STOCK when:
//
// current quantity <= reorder level
//
// Example:
// quantity = 5
// reorderLevel = 10
//
// 5 <= 10 → LOW STOCK
    public List<MedicineResponse> getLowStockMedicines() {

        return medicineRepository.findLowStockMedicines()
                .stream()
                .map(MedicineResponse::new)
                .toList();
    }

    // Get medicines that are completely out of stock.
    public List<MedicineResponse> getOutOfStockMedicines() {

        return medicineRepository.findByQuantity(0)
                .stream()
                .map(MedicineResponse::new)
                .toList();
    }

    // =========================================================
    // GET MEDICINE BY ID
    // =========================================================

    // Get medicines that have already expired.
    public List<MedicineResponse> getExpiredMedicines() {

        return medicineRepository.findExpiredMedicines()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get medicines that will expire within the next 30 days.
    public List<MedicineResponse> getNearExpiryMedicines() {

        LocalDate today = LocalDate.now();

        LocalDate nearExpiryDate = today.plusDays(30);

        return medicineRepository
                .findByExpiryDateBetween(today, nearExpiryDate)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }
    public MedicineResponse getMedicineById(Long id) {

        // ID එකෙන් medicine එක search කරනවා
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found with id: " + id)
                );

        return convertToResponse(medicine);
    }


    // =========================================================
    // UPDATE MEDICINE
    // =========================================================

    public MedicineResponse updateMedicine(Long id, MedicineRequest request) {

        // මුලින් existing medicine එක හොයනවා
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found with id: " + id)
                );

        // Check whether the new supplier exists.
        if (request.getSupplier() != null &&
                !request.getSupplier().isBlank()) {

            supplierRepository.findByName(request.getSupplier())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Supplier not found: " + request.getSupplier()
                            )
                    );
        }
        // Existing data update කරනවා
        medicine.setMedicineName(request.getMedicineName());
        medicine.setGenericName(request.getGenericName());
        medicine.setCategory(request.getCategory());
        medicine.setSupplier(request.getSupplier());
        medicine.setBatchNumber(request.getBatchNumber());
        medicine.setQuantity(request.getQuantity());
        medicine.setUnitPrice(request.getUnitPrice());
        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setReorderLevel(request.getReorderLevel());

        // Updated medicine එක database එකට save කරනවා
        Medicine updatedMedicine = medicineRepository.save(medicine);

        return convertToResponse(updatedMedicine);
    }


    // =========================================================
    // DELETE MEDICINE
    // =========================================================

    public void deleteMedicine(Long id) {

        // Medicine එක තිබෙනවාද බලනවා
        if (!medicineRepository.existsById(id)) {
            throw new RuntimeException(
                    "Medicine not found with id: " + id
            );
        }

        // Database එකෙන් delete කරනවා
        medicineRepository.deleteById(id);
    }


    // =========================================================
    // ENTITY → RESPONSE DTO
    // =========================================================

    private MedicineResponse convertToResponse(Medicine medicine) {

        MedicineResponse response = new MedicineResponse();

        response.setId(medicine.getId());
        response.setMedicineName(medicine.getMedicineName());
        response.setGenericName(medicine.getGenericName());
        response.setCategory(medicine.getCategory());
        response.setSupplier(medicine.getSupplier());
        response.setBatchNumber(medicine.getBatchNumber());
        response.setQuantity(medicine.getQuantity());
        response.setUnitPrice(medicine.getUnitPrice());
        response.setExpiryDate(medicine.getExpiryDate());
        response.setReorderLevel(medicine.getReorderLevel());
        response.setCreatedAt(medicine.getCreatedAt());
        response.setUpdatedAt(medicine.getUpdatedAt());

        return response;
    }

    public Map<String, Long> getDashboardSummary() {

        long totalMedicines = medicineRepository.count();

        long lowStock = medicineRepository.findLowStockMedicines()
                .size();

        long outOfStock = medicineRepository.findByQuantity(0)
                .size();

        long expired = medicineRepository.findExpiredMedicines()
                .size();

        LocalDate today = LocalDate.now();
        LocalDate nearExpiryDate = today.plusDays(30);

        long nearExpiry = medicineRepository
                .findByExpiryDateBetween(today, nearExpiryDate)
                .size();

        long totalSuppliers = supplierRepository.count();

        Map<String, Long> summary = new HashMap<>();

        summary.put("totalMedicines", totalMedicines);
        summary.put("lowStock", lowStock);
        summary.put("outOfStock", outOfStock);
        summary.put("expired", expired);
        summary.put("nearExpiry", nearExpiry);
        summary.put("totalSuppliers", totalSuppliers);

        return summary;
    }

    public List<MedicineResponse> searchMedicines(String keyword) {

        return medicineRepository.searchMedicines(keyword)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<MedicineResponse> getMedicinesByCategory(String category) {

        return medicineRepository
                .findByCategoryIgnoreCase(category)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public Page<MedicineResponse> getMedicinesPaginated(Pageable pageable) {

        return medicineRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    // =========================================================
// SERVER-SIDE SEARCH + FILTER + PAGINATION
// =========================================================

public Page<MedicineResponse> getMedicinesWithFilter(
        String keyword,
        String filter,
        Pageable pageable
) {

    if (keyword == null) {
        keyword = "";
    }

    if (filter == null || filter.isBlank()) {
        filter = "ALL";
    }

    keyword = keyword.trim();

    filter = filter.toUpperCase();

    // Near expiry = next 30 days
    LocalDate nearExpiryDate =
            LocalDate.now().plusDays(30);


    // Validate filter

    if (!filter.equals("ALL") &&
            !filter.equals("LOW_STOCK") &&
            !filter.equals("OUT_OF_STOCK") &&
            !filter.equals("NEAR_EXPIRY") &&
            !filter.equals("EXPIRED")) {

        throw new RuntimeException(
                "Invalid medicine filter"
        );
    }


    Page<Medicine> medicines =
            medicineRepository.findMedicinesWithFilter(
                    keyword,
                    filter,
                    nearExpiryDate,
                    pageable
            );


    return medicines.map(
            MedicineResponse::new
    );
}

}