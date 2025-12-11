package com.example.fashion.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.lang.reflect.Method;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    // KEY CỐ ĐỊNH – KHÔNG BAO GIỜ ĐỔI KHI RESTART (đã thay cho dòng cũ)
    private final SecretKey jwtSecretKey = Keys.hmacShaKeyFor(
            "myVeryLongSecretKeyForFashionEcommerce2025ThisMustBeAtLeast512Bits1234567890abc".getBytes()
    );

    // Thời gian hết hạn token: 24h
    private final long jwtExpirationInMs = 24 * 60 * 60 * 1000L;

    public String generateToken(Authentication authentication) {
        String email = authentication.getName();

        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        List<Integer> allowedWarehouses = resolveAllowedWarehouses(authentication);

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(email)
                .claim("roles", authorities)
                .claim("allowedWarehouses", allowedWarehouses)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(jwtSecretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    @SuppressWarnings("unchecked")
    private List<Integer> resolveAllowedWarehouses(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal != null) {
            try {
                Method m = principal.getClass().getMethod("getAllowedWarehouses");
                Object value = m.invoke(principal);
                if (value instanceof Collection<?>) {
                    return ((Collection<?>) value).stream()
                            .map(v -> {
                                if (v instanceof Number) return ((Number) v).intValue();
                                try { return Integer.parseInt(String.valueOf(v)); }
                                catch (NumberFormatException ex) { return null; }
                            })
                            .filter(v -> v != null)
                            .collect(Collectors.toList());
                }
            } catch (NoSuchMethodException ignore) {
            } catch (Exception ex) {
                System.out.println("Không thể trích xuất allowedWarehouses từ principal: " + ex.getMessage());
            }
        }

        Object details = authentication.getDetails();
        if (details instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) details;
            Object value = map.get("allowedWarehouses");
            if (value instanceof Collection<?>) {
                return ((Collection<?>) value).stream()
                        .map(v -> {
                            if (v instanceof Number) return ((Number) v).intValue();
                            try { return Integer.parseInt(String.valueOf(v)); }
                            catch (NumberFormatException ex) { return null; }
                        })
                        .filter(v -> v != null)
                        .collect(Collectors.toList());
            }
        }

        return Collections.emptyList();
    }

    public String getEmailFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(jwtSecretKey)
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (Exception ex) {
            System.out.println("Lỗi xác thực JWT: " + ex.getMessage());
        }
        return false;
    }
}