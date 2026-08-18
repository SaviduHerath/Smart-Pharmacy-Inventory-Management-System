package com.pharmacy.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 * මේ Controller එක authorization test කරන්න විතරයි.
 *
 * පස්සේ actual:
 *
 * - AdminController
 * - PharmacistController
 * - CustomerController
 *
 * හදනකොට මේ logic එක use කරමු.
 */
@RestController

/*
 * මේ Controller එකේ සියලු endpoints
 * /api යටතේ තියෙනවා.
 */
@RequestMapping("/api")
public class TestController {


    /*
     * ==========================================
     * ADMIN TEST ENDPOINT
     * ==========================================
     *
     * SecurityConfig එකේ:
     *
     * /api/admin/**
     *
     * ADMIN role එකට විතරක් allow කරලා තියෙනවා.
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
     * PHARMACIST role එකට විතරක් access.
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
     * CUSTOMER role එකට විතරක් access.
     */
    @GetMapping("/customer/test")
    public String customerTest() {

        return "CUSTOMER access successful";
    }
}