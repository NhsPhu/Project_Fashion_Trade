package com.example.fashion.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    // (1) Tạo một khóa bí mật (Secret Key) an toàn.
    // Trong thực tế, khóa này nên được đọc từ file config
    private final SecretKey jwtSecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    // (2) Thời gian hết hạn của Token (ví dụ: 1 ngày)
    private final long jwtExpirationInMs = 86400000; // 1 day = 24 * 60 * 60 * 1000

    /**
     * Tạo ra một JWT từ thông tin xác thực của người dùng
     */
    public String generateToken(Authentication authentication) {

        String email = authentication.getName();

        // Lấy danh sách các quyền (roles) của người dùng
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        // (3) Tạo Token
        return Jwts.builder()
                .setSubject(email) // Gán email vào "subject"
                .claim("roles", authorities) // Thêm thông tin "roles" vào token
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(jwtSecretKey, SignatureAlgorithm.HS512) // Ký tên bằng khóa bí mật
                .compact();
    }

    /**
     * Lấy email (subject) từ JWT
     */
    public String getEmailFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    /**
     * Xác thực Token
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(jwtSecretKey)
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (Exception ex) {
            // (Nên log lỗi ở đây: Token không hợp lệ, hết hạn, v.v.)
            System.out.println("Lỗi xác thực JWT: " + ex.getMessage());
        }
        return false;
    }
}