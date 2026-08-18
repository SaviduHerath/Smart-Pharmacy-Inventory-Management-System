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

    // JWT sign කරන්න use කරන secret key එක.
    // Production application එකක මේක application.properties
    // / environment variable එකක තියාගන්න.
    private static final String SECRET_KEY =
            "my-super-secret-key-for-pharmacy-management-system-2026";

    // Token එක valid වෙන කාලය.
    // මෙතන පැය 24ක් set කරලා තියෙනවා.
    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24;

    // Secret key එකෙන් cryptographic key එක create කරන method එක.
    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }

    // User login successful උනාට පස්සේ JWT token එක generate කරන method එක.
    public String generateToken(User user) {

        return Jwts.builder()

                // Token එකේ subject විදිහට email එක save කරනවා.
                .subject(user.getEmail())

                // Userගේ role එක token එකේ claim එකක් විදිහට save කරනවා.
                .claim("role", user.getRole())

                // Token එක create කරපු වෙලාව.
                .issuedAt(new Date())

                // Token එක expire වෙන වෙලාව.
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )

                // Secret key එකෙන් token එක digitally sign කරනවා.
                .signWith(getSigningKey())

                // JWT string එක return කරනවා.
                .compact();
    }
    // JWT token එකෙන් email extract කරනවා.
    public String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }


    // Token එක මේ userට අදාළ valid token එකක්ද check කරනවා.
    public boolean isTokenValid(
            String token,
            User user
    ) {

        // Token එකේ email එක extract කරනවා.
        String email = extractEmail(token);

        // Token expiry date එක ගන්නවා.
        Date expiration =
                Jwts.parser()
                        .verifyWith(getSigningKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
                        .getExpiration();

        // Email match වෙන්න ඕන
        // සහ token expire වෙලා තියෙන්න බැහැ.
        return email.equals(user.getEmail())
                && expiration.after(new Date());
    }
}