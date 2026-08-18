package com.pharmacy.service;

import com.pharmacy.dto.LoginRequest;
import com.pharmacy.dto.LoginResponse;
import com.pharmacy.entity.User;
import com.pharmacy.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    /*
     * Database එකෙන් User හොයන්න Repository එක use කරනවා.
     */
    private final UserRepository userRepository;


    /*
     * User password එක database password එකත් එක්ක
     * compare කරන්න PasswordEncoder use කරනවා.
     */
    private final PasswordEncoder passwordEncoder;


    /*
     * JWT token generate කරන්න JwtService use කරනවා.
     */
    private final JwtService jwtService;


    /*
     * Constructor injection.
     *
     * Spring automatically මේ dependencies 3 inject කරනවා.
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
         * User enter කරපු email එකෙන්
         * database එකේ user හොයනවා.
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
         * User enter කරපු plain password එක
         *
         * Database එකේ තියෙන BCrypt hashed password
         *
         * එක්ක compare කරනවා.
         */
        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );


        /*
         * Password එක incorrect නම්
         * login reject කරනවා.
         */
        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        /*
         * Step 3:
         *
         * Email + Role ඇතුළත් JWT token එක generate කරනවා.
         */
        String token =
                jwtService.generateToken(user);


        /*
         * Step 4:
         *
         * Frontend එකට login response එක return කරනවා.
         */
        return new LoginResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
}