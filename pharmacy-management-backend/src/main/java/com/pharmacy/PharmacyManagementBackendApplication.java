package com.pharmacy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/*
 * @SpringBootApplication කියන්නේ මේක
 * අපේ Spring Boot application's main class එක
 * කියලා Springට කියන annotation එක.
 *
 * මේ annotation එකෙන්:
 *
 * 1. Spring Boot configuration enable කරනවා
 * 2. Component scanning කරනවා
 * 3. Auto configuration enable කරනවා
 */
@SpringBootApplication
public class PharmacyManagementBackendApplication {

    /*
     * Java application එක start වෙන main method එක.
     */
    public static void main(String[] args) {

        /*
         * මේ line එකෙන් Spring Boot application එක
         * start කරනවා.
         *
         * ඒකෙන්:
         *
         * - Spring Container start වෙනවා
         * - Database connection setup වෙනවා
         * - Security setup වෙනවා
         * - Controllers load වෙනවා
         * - Services load වෙනවා
         * - Repository beans load වෙනවා
         * - Tomcat server start වෙනවා
         */
        SpringApplication.run(
                PharmacyManagementBackendApplication.class,
                args
        );
    }
}