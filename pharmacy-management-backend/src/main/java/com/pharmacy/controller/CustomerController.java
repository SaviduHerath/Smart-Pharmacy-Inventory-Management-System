package com.pharmacy.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomerController {

    @GetMapping("/api/customer/dashboard")
    public String dashboard() {

        return "Welcome to Customer Dashboard";
    }
}