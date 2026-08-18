package com.pharmacy.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PharmacistController {

    @GetMapping("/api/pharmacist/dashboard")
    public String dashboard() {

        return "Welcome to Pharmacist Dashboard";
    }
}