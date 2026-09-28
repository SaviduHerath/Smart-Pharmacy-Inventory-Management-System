package com.pharmacy.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 * This Controller is only for authorization testing.
 *
 * Later actual:
 *
 * - AdminController
 * - PharmacistController
 * - CustomerController
 *
 * let's use this logic when building.
 */
@RestController

/*
 * All endpoints in this Controller
 * are under /api.
 */
@RequestMapping("/api")
public class TestController {


    /*
     * ==========================================
     * ADMIN TEST ENDPOINT
     * ==========================================
     *
     * In SecurityConfig:
     *
     * /api/admin/**
     *
     * Allowed only for ADMIN role.
     */
    @GetMapping("/admin/test")
    public String adminTest() {

        return "ADMIN access successful";
    }


    /*
     * ==========================================
     * PHARMACIST TEST ENDPOINT
     * ==========================================
     *
     * /api/pharmacist/**
     *
     * Access only for PHARMACIST role.
     */
    @GetMapping("/pharmacist/test")
    public String pharmacistTest() {

        return "PHARMACIST access successful";
    }


    /*
     * ==========================================
     * CUSTOMER TEST ENDPOINT
     * ==========================================
     *
     * /api/customer/**
     *
     * Access only for CUSTOMER role.
     */
    @GetMapping("/customer/test")
    public String customerTest() {

        return "CUSTOMER access successful";
    }
}