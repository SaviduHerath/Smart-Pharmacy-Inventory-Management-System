package com.pharmacy.service;

import com.pharmacy.dto.LoginRequest;
import com.pharmacy.dto.LoginResponse;
import com.pharmacy.entity.User;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.dto.RegisterRequest;
import com.pharmacy.dto.UserResponse;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    /*
     * Using Repository to find User from Database.
     */
    private final UserRepository userRepository;


    /*
     * Used to compare user password with database password
     * using PasswordEncoder.
     */
    private final PasswordEncoder passwordEncoder;


    /*
     * Using JwtService to generate JWT token.
     */
    private final JwtService jwtService;


    /*
     * Constructor injection.
     *
     * Spring automatically injects these 3 dependencies.
     */
    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    /*
     * ============================
     * LOGIN BUSINESS LOGIC
     * ============================
     */
    public LoginResponse login(LoginRequest request) {


        /*
         * Step 1:
         *
         * Finding user in database
         * using the entered email.
         */
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );


        /*
         * Step 2:
         *
         * Comparing user entered plain password
         *
         * with the BCrypt hashed password
         *
         * in the Database.
         */
        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );


        /*
         * If password is incorrect,
         * reject login.
         */
        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        /*
         * Step 3:
         *
         * Generating JWT token containing Email + Role.
         */
        String token =
                jwtService.generateToken(user);


        /*
         * Step 4:
         *
         * Returning login response to frontend.
         */
        return new LoginResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }

   
        public UserResponse register(RegisterRequest request) {

        // Email already exists?
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // Hashing password
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // IMPORTANT:
        // Not allowing user to control role from public registration.
        user.setRole("CUSTOMER");

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
        }


}