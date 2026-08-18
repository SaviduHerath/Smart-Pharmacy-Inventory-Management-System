package com.pharmacy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    /*
     * අපි කලින් හදපු JWT Authentication Filter එක.
     *
     * මේ filter එක request එකේ JWT token එක
     * check කරනවා.
     */
    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    /*
     * Constructor Injection.
     *
     * Spring automatically JwtAuthenticationFilter
     * object එක මෙතනට inject කරනවා.
     */
    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    /*
     * ============================================
     * PASSWORD ENCODER
     * ============================================
     *
     * User register වෙනකොට password එක
     * BCrypt hash එකක් බවට convert කරන්න මේක use කරනවා.
     *
     * Example:
     *
     * 123456
     *     ↓
     * $2a$10$............
     */
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    /*
     * ============================================
     * SECURITY FILTER CHAIN
     * ============================================
     *
     * Application එකේ security rules මෙතන define කරනවා.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {


        http

                /*
                 * =====================================
                 * CSRF
                 * =====================================
                 *
                 * REST API + JWT authentication use කරන නිසා
                 * CSRF disable කරනවා.
                 */
                .csrf(csrf -> csrf.disable())


                /*
                 * =====================================
                 * SESSION MANAGEMENT
                 * =====================================
                 *
                 * අපි session-based login use කරන්නේ නැහැ.
                 *
                 * JWT එක තමයි authentication එක.
                 *
                 * ඒ නිසා STATELESS.
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                /*
                 * =====================================
                 * AUTHORIZATION RULES
                 * =====================================
                 */
                .authorizeHttpRequests(auth -> auth


                        /*
                         * ---------------------------------
                         * PUBLIC ENDPOINTS
                         * ---------------------------------
                         *
                         * Login කරන්න JWT token එකක්
                         * තිබිය නොහැක.
                         *
                         * ඒ නිසා login සහ register
                         * public.
                         */
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()


                        /*
                         * ---------------------------------
                         * ADMIN ONLY
                         * ---------------------------------
                         *
                         * /api/admin/**
                         * endpoints access කරන්න පුළුවන්
                         * ADMIN role එකට විතරයි.
                         */
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")


                        /*
                         * ---------------------------------
                         * PHARMACIST ONLY
                         * ---------------------------------
                         */
                        .requestMatchers(
                                "/api/pharmacist/**"
                        ).hasRole("PHARMACIST")


                        /*
                         * ---------------------------------
                         * CUSTOMER ONLY
                         * ---------------------------------
                         */
                        .requestMatchers(
                                "/api/customer/**"
                        ).hasRole("CUSTOMER")


                        /*
                         * ---------------------------------
                         * OTHER ENDPOINTS
                         * ---------------------------------
                         *
                         * ඉහත rules වලට match නොවන
                         * සියලු endpoints වලට login අවශ්‍යයි.
                         */
                        .anyRequest().authenticated()
                );


        /*
         * ============================================
         * JWT FILTER
         * ============================================
         *
         * UsernamePasswordAuthenticationFilter එකට
         * කලින් අපේ JWT filter එක run කරනවා.
         *
         * ඒ නිසා request එක Controller එකට යන්න කලින්
         * JWT token එක verify වෙනවා.
         */
        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );


        /*
         * Final SecurityFilterChain එක return කරනවා.
         */
        return http.build();
    }
}