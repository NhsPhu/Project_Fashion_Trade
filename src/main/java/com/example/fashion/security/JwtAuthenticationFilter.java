package com.example.fashion.security;

import com.example.fashion.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                // --- DEBUG LOG START ---
                System.out.println("🔍 [FILTER] Tìm thấy Token: " + jwt.substring(0, 15) + "...");

                boolean isValid = tokenProvider.validateToken(jwt);
                System.out.println("🔍 [FILTER] Token Valid? " + isValid);

                if (isValid) {
                    String email = tokenProvider.getEmailFromJWT(jwt);
                    System.out.println("🔍 [FILTER] Email từ Token: " + email);

                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                    // KIỂM TRA QUYỀN THỰC TẾ
                    System.out.println("🔍 [FILTER] User tải được: " + userDetails.getUsername());
                    System.out.println("🔍 [FILTER] Quyền (Authorities): " + userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("✅ [FILTER] Đã set Authentication thành công!");
                }
            } else {
                // System.out.println("⚠️ [FILTER] Không thấy Token trong request này.");
            }
        } catch (Exception ex) {
            System.err.println("❌ [FILTER ERROR] Lỗi nghiêm trọng: " + ex.getMessage());
            ex.printStackTrace(); // In chi tiết lỗi ra để sửa
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}