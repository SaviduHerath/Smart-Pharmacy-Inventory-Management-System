package com.pharmacy.service;

import com.pharmacy.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    // Secret key used to sign JWT.
    // In production, keep this in application.properties
    // or in an environment variable.
    private static final String SECRET_KEY =
            "my-super-secret-key-for-pharmacy-management-system-2026";

    // Token validity duration.
    // Set to 24 hours here.
    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24;

    // Method to create cryptographic key from secret key.
    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }

    // Method to generate JWT token after successful login.
    public String generateToken(User user) {

        return Jwts.builder()

                // Saving email as token subject.
                .subject(user.getEmail())

                // Saving user role as a token claim.
                .claim("role", user.getRole())

                // Token creation time.
                .issuedAt(new Date())

                // Token expiration time.
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )

                // Digitally signing the token with secret key.
                .signWith(getSigningKey())

                // Returning JWT string.
                .compact();
    }
    // Extracting email from JWT token.
    public String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }


    // Checking if token is valid for this user.
    public boolean isTokenValid(
            String token,
            User user
    ) {

        // Extracting email from token.
        String email = extractEmail(token);

        // Getting token expiry date.
        Date expiration =
                Jwts.parser()
                        .verifyWith(getSigningKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
                        .getExpiration();

        // Email must match
        // and token cannot be expired.
        return email.equals(user.getEmail())
                && expiration.after(new Date());
    }
}