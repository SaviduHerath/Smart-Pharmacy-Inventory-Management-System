package com.pharmacy.service;

import com.pharmacy.dto.MedicineRequest;
import com.pharmacy.dto.MedicineResponse;
import com.pharmacy.entity.Medicine;
import com.pharmacy.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    // Repository එක Service එකට inject කරනවා
    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
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

}