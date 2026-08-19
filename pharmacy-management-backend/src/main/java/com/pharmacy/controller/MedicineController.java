package com.pharmacy.controller;

import com.pharmacy.dto.MedicineRequest;
import com.pharmacy.dto.MedicineResponse;
import com.pharmacy.service.MedicineService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicineController {

    private final MedicineService medicineService;


    // MedicineService එක Controller එකට inject කරනවා
    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }


    // =========================================================
    // CREATE MEDICINE
    // POST /api/medicines
    // =========================================================

    @PostMapping
    public ResponseEntity<MedicineResponse> createMedicine(
            @RequestBody MedicineRequest request) {

        // Frontend එකෙන් ලැබෙන JSON data
        // MedicineRequest DTO එකට convert වෙනවා

        MedicineResponse response =
                medicineService.createMedicine(request);

        // 201 CREATED response එකක් return කරනවා
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // GET ALL MEDICINES
    // GET /api/medicines
    // =========================================================

    @GetMapping
    public ResponseEntity<List<MedicineResponse>> getAllMedicines() {

        // Database එකේ තියෙන සියලු medicines ලබාගන්නවා
        List<MedicineResponse> medicines =
                medicineService.getAllMedicines();

        return ResponseEntity.ok(medicines);
    }

    // Get all medicines that are low in stock.
    @GetMapping("/low-stock")
    public ResponseEntity<List<MedicineResponse>> getLowStockMedicines() {

        return ResponseEntity.ok(
                medicineService.getLowStockMedicines()
        );
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<List<MedicineResponse>> getOutOfStockMedicines() {

        List<MedicineResponse> medicines =
                medicineService.getOutOfStockMedicines();

        return ResponseEntity.ok(medicines);
    }

    @GetMapping("/expired")
    public ResponseEntity<List<MedicineResponse>> getExpiredMedicines() {

        return ResponseEntity.ok(
                medicineService.getExpiredMedicines()
        );
    }

    @GetMapping("/near-expiry")
    public ResponseEntity<List<MedicineResponse>> getNearExpiryMedicines() {

        return ResponseEntity.ok(
                medicineService.getNearExpiryMedicines()
        );
    }
    // =========================================================
    // GET MEDICINE BY ID
    // GET /api/medicines/{id}
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<MedicineResponse> getMedicineById(
            @PathVariable Long id) {

        // URL එකෙන් ID එක ලබාගන්නවා
        // උදා: /api/medicines/5

        MedicineResponse medicine =
                medicineService.getMedicineById(id);

        return ResponseEntity.ok(medicine);
    }


    // =========================================================
    // UPDATE MEDICINE
    // PUT /api/medicines/{id}
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<MedicineResponse> updateMedicine(
            @PathVariable Long id,
            @RequestBody MedicineRequest request) {

        // Existing medicine එක update කරනවා

        MedicineResponse updatedMedicine =
                medicineService.updateMedicine(id, request);

        return ResponseEntity.ok(updatedMedicine);
    }


    // =========================================================
    // DELETE MEDICINE
    // DELETE /api/medicines/{id}
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(
            @PathVariable Long id) {

        // Medicine එක delete කරනවා
        medicineService.deleteMedicine(id);

        return ResponseEntity.ok(
                "Medicine deleted successfully"
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Long>> getDashboardSummary() {

        return ResponseEntity.ok(
                medicineService.getDashboardSummary()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<MedicineResponse>> searchMedicines(
            @RequestParam String keyword
    ) {

        return ResponseEntity.ok(
                medicineService.searchMedicines(keyword)
        );
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MedicineResponse>> getMedicinesByCategory(
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                medicineService.getMedicinesByCategory(category)
        );
    }

    @GetMapping("/page")
    public ResponseEntity<Page<MedicineResponse>> getMedicinesPaginated(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "id") String sortBy,

            @RequestParam(defaultValue = "asc") String direction

    ) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        PageRequest pageable =
                PageRequest.of(page, size, sort);

        return ResponseEntity.ok(
                medicineService.getMedicinesPaginated(pageable)
        );
    }


}