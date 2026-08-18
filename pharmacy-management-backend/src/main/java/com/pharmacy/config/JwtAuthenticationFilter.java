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
     * JWT token එක decode / validate කරන්න.
     */
    private final JwtService jwtService;

    /*
     * JWT එකෙන් ගත්ත email එකෙන්
     * database එකේ User හොයන්න.
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
     * මේ method එක request එකක් backend එකට එන
     * හැම වෙලාවකම execute වෙනවා.
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        /*
         * Request එකේ Authorization header එක ගන්නවා.
         *
         * Expected:
         *
         * Authorization: Bearer eyJhbGciOi...
         */
        String authHeader =
                request.getHeader("Authorization");


        /*
         * Authorization header එක නැත්නම්
         * මේ request එකේ JWT නැහැ.
         *
         * එතකොට request එක stop නොකර
         * ඊළඟ filter එකට යවනවා.
         */
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }


        /*
         * "Bearer " කොටස remove කරලා
         * actual JWT token එක ගන්නවා.
         */
        String token =
                authHeader.substring(7);


        try {

            /*
             * JWT එකෙන් email එක extract කරනවා.
             */
            String email =
                    jwtService.extractEmail(token);


            /*
             * Email එක ලැබුණා නම්
             * database එකෙන් User හොයනවා.
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
                     * Userගේ role එක Spring Security
                     * authority එකක් බවට convert කරනවා.
                     *
                     * ADMIN
                     * PHARMACIST
                     * CUSTOMER
                     *
                     * Spring Security convention එක අනුව
                     * ROLE_ prefix එක use කරනවා.
                     */
                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority(
                                    "ROLE_" + user.getRole()
                            );


                    /*
                     * Authenticated user object එක create කරනවා.
                     */
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    List.of(authority)
                            );


                    /*
                     * Spring Security Context එකට
                     * authenticated user set කරනවා.
                     */
                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (Exception e) {

            /*
             * JWT invalid / expired / malformed නම්
             * authentication set කරන්නේ නැහැ.
             *
             * Request එක continue වෙනවා.
             *
             * Protected endpoint එකක් නම්
             * SecurityConfig එකෙන් 401 return කරයි.
             */
        }


        /*
         * ඊළඟ security filter එකට request එක යවනවා.
         */
        filterChain.doFilter(request, response);
    }
}