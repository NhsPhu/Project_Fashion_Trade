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

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // BỎ QUA HOÀN TOÀN CÁC PUBLIC API
        if (isPublicRequest(path, method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // CHỈ XỬ LÝ JWT NẾU KHÔNG PHẢI PUBLIC
        String jwt = getJwtFromRequest(request);
        if (StringUtils.hasText(jwt)) {
            try {
                if (tokenProvider.validateToken(jwt)) {
                    String email = tokenProvider.getEmailFromJWT(jwt);
                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // Token lỗi → bỏ qua, KHÔNG ném 403
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicRequest(String path, String method) {
        // CORS preflight
        if ("OPTIONS".equalsIgnoreCase(method)) return true;

        // Auth APIs
        if (path.startsWith("/api/v1/auth/") || path.startsWith("/api/v1/admin/auth/")) return true;

        // Public GET APIs
        if ("GET".equalsIgnoreCase(method)) {
            return path.startsWith("/api/v1/public/products/") ||
                    path.startsWith("/api/v1/products/") ||
                    path.startsWith("/api/v1/categories/") ||
                    path.startsWith("/api/v1/brands/");
        }

        return false;
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}