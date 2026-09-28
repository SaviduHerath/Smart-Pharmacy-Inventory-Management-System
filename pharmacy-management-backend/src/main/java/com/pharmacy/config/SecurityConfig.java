package com.pharmacy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration

@EnableMethodSecurity
public class SecurityConfig {

    /*
     * The JWT Authentication Filter we created earlier.
     *
     * This filter checks the JWT token
     * in the request.
     */
    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    /*
     * Constructor Injection.
     *
     * Spring automatically JwtAuthenticationFilter
     * object is injected here.
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
     * Used to convert password to BCrypt hash
     * when user registers.
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
     * Defining security rules of the application here.
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
                 * Since we use REST API + JWT authentication,
                 * CSRF is disabled.
                 */
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})

                /*
                 * =====================================
                 * SESSION MANAGEMENT
                 * =====================================
                 *
                 * We are not using session-based login.
                 *
                 * JWT is used for authentication.
                 *
                 * Therefore, it is STATELESS.
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
                         * A JWT token is not required
                         * to login.
                         *
                         * So login and register
                         * public.
                         */
                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()

                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()


                        /*
                         * ---------------------------------
                         * ADMIN ONLY
                         * ---------------------------------
                         *
                         * /api/admin/**
                         * endpoints can be accessed.
                         * Only for ADMIN role.
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

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/medicines",
                                "/api/medicines/**"
                        ).hasAnyRole("ADMIN", "PHARMACIST", "CUSTOMER")

                        .requestMatchers(
                                "/api/medicines",
                                "/api/medicines/**"
                        ).hasAnyRole("ADMIN", "PHARMACIST")

                        .requestMatchers("/api/suppliers/**")
                        .hasAnyRole("ADMIN", "PHARMACIST")

                        .requestMatchers("/api/stock/**")
                        .hasAnyRole("ADMIN", "PHARMACIST")

                        .requestMatchers("/api/cart/**")
                        .hasRole("CUSTOMER")

                        .requestMatchers(HttpMethod.POST, "/api/orders")
                        .hasRole("CUSTOMER")

                        .requestMatchers(HttpMethod.GET, "/api/orders")
                        .hasAnyRole("ADMIN", "PHARMACIST")

                        .requestMatchers(HttpMethod.GET, "/api/orders/my")
                        .hasRole("CUSTOMER")

                        .requestMatchers(HttpMethod.PUT, "/api/orders/*/cancel")
                        .hasRole("CUSTOMER")

                        .requestMatchers(HttpMethod.GET, "/api/orders/*")
                        .hasAnyRole("ADMIN", "PHARMACIST", "CUSTOMER")

                        .requestMatchers("/api/orders/**")
                        .hasAnyRole("ADMIN", "PHARMACIST")

                        .requestMatchers(
                                "/api/customer/**"
                        ).hasRole("CUSTOMER")

                        .anyRequest().authenticated()
                );


        /*
         * ============================================
         * JWT FILTER
         * ============================================
         *
         * Running our JWT filter before
         * UsernamePasswordAuthenticationFilter.
         *
         * So JWT token is verified before
         * request goes to Controller.
         */
        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );


        /*
         * Returning final SecurityFilterChain.
         */
        return http.build();
    }
}