package com.pharmacy.controller;

import com.pharmacy.dto.MedicineResponse;
import com.pharmacy.service.MedicineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final MedicineService medicineService;

    public CustomerController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "Welcome to Customer Dashboard";
    }

    @GetMapping("/medicines")
    public ResponseEntity<List<MedicineResponse>> getMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }
}
