package com.example.fashion.security;

import com.example.fashion.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
<<<<<<< HEAD
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
=======
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        if (isPublicRequest(path, method)) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = getJwtFromRequest(request);
        if (StringUtils.hasText(jwt)) {
            try {
                if (tokenProvider.validateToken(jwt)) {
                    String email = tokenProvider.getEmailFromJWT(jwt);
                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                    // THÊM MỚI: LẤY DANH SÁCH KHO TỪ DB
                    List<Long> allowedWarehouses = customUserDetailsService.getAllowedWarehouseIdsByEmail(email);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    // Nhét allowedWarehouses vào details để JwtTokenProvider đọc được
                    Map<String, Object> details = new HashMap<>();
                    details.put("allowedWarehouses", allowedWarehouses);
                    authentication.setDetails(details);

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // Token lỗi → bỏ qua, KHÔNG ném 403
            }
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
        }

        filterChain.doFilter(request, response);
    }

<<<<<<< HEAD
=======
    private boolean isPublicRequest(String path, String method) {
        if ("OPTIONS".equalsIgnoreCase(method)) return true;
        if (path.startsWith("/api/v1/auth/") || path.startsWith("/api/v1/admin/auth/")) return true;

        if ("GET".equalsIgnoreCase(method)) {
            return path.startsWith("/api/v1/public/products/") ||
                    path.startsWith("/api/v1/products/") ||
                    path.startsWith("/api/v1/categories/") ||
                    path.startsWith("/api/v1/brands/");
        }
        return false;
    }

>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}