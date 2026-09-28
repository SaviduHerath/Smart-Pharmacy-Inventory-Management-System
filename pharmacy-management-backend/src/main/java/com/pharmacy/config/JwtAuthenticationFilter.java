package com.pharmacy.config;

import com.pharmacy.entity.User;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /*
     * Decode / validate JWT token.
     */
    private final JwtService jwtService;

    /*
     * Find user in database
     * using email from JWT.
     */
    private final UserRepository userRepository;


    /*
     * Constructor injection.
     */
    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }


    /*
     * This method executes every time
     * a request comes to the backend.
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        /*
         * Getting Authorization header from Request.
         *
         * Expected:
         *
         * Authorization: Bearer eyJhbGciOi...
         */
        String authHeader =
                request.getHeader("Authorization");


        /*
         * If Authorization header is missing
         * there is no JWT in this request.
         *
         * Then without stopping the request
         * forwarding to the next filter.
         */
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }


        /*
         * Removing "Bearer " part
         * and getting the actual JWT token.
         */
        String token =
                authHeader.substring(7);


        try {

            /*
             * Extracting email from JWT.
             */
            String email =
                    jwtService.extractEmail(token);


            /*
             * If email is found
             * searching User in database.
             */
            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {


                User user =
                        userRepository
                                .findByEmail(email)
                                .orElse(null);


                if (user != null &&
                        jwtService.isTokenValid(token, user)) {


                    /*
                     * Converting User's role to a
                     * Spring Security authority.
                     *
                     * ADMIN
                     * PHARMACIST
                     * CUSTOMER
                     *
                     * According to Spring Security convention
                     * using ROLE_ prefix.
                     */
                    String role = user.getRole() == null
                            ? ""
                            : user.getRole().trim().toUpperCase();

                    if (role.startsWith("ROLE_")) {
                        role = role.substring(5);
                    }

                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority("ROLE_" + role);


                    /*
                     * Creating authenticated user object.
                     */
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    List.of(authority)
                            );


                    /*
                     * Setting authenticated user
                     * in Spring Security Context.
                     */
                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (Exception e) {

            /*
             * If JWT is invalid / expired / malformed
             * authentication is not set.
             *
             * Request continues.
             *
             * If it is a protected endpoint
             * SecurityConfig returns 401.
             */
        }


        /*
         * Forwarding request to next security filter.
         */
        filterChain.doFilter(request, response);
    }
}