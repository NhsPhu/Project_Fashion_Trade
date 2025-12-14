package com.example.fashion.config;

import com.example.fashion.security.JwtAuthenticationFilter;
import com.example.fashion.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Cho phép dùng @PreAuthorize ở Controller nếu cần
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtAuthenticationFilter jwtFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * --- CẤU HÌNH CORS ---
     * Cho phép Frontend (ReactJS tại localhost:3000) gọi API
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Domain Frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        configuration.setAllowedHeaders(List.of("*")); // Cho phép mọi Header (như Authorization, Content-Type)
        configuration.setAllowCredentials(true); // Cho phép gửi Cookie/Credentials nếu cần

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF (Do dùng JWT stateless)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Kích hoạt CORS (Sử dụng Bean corsConfigurationSource bên trên)
                .cors(Customizer.withDefaults())

                // 3. Quản lý Session: Stateless (Không lưu session server-side)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Phân quyền truy cập (Authorize Requests)
                .authorizeHttpRequests(auth -> auth
                        // --- A. PUBLIC ENDPOINTS (KHÔNG CẦN ĐĂNG NHẬP) ---

                        // Static Resources (Ảnh, JS, CSS...)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/product_image/**", "/uploads/**", "/css/**", "/js/**", "/images/**", "/assets/**").permitAll()

                        // Authentication (Đăng nhập/Đăng ký) - Mở cả 2 dạng đường dẫn để tránh lỗi
                        .requestMatchers("/api/auth/**").permitAll()      // <-- Fix lỗi 403 cho Service cũ
                        .requestMatchers("/api/v1/auth/**","/api/v1/files/images/**").permitAll()   // <-- Đường dẫn chuẩn v1
                        .requestMatchers("/api/v1/admin/auth/**").permitAll()

                        // Public API: Xem sản phẩm, danh mục, thương hiệu (Chỉ method GET)
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/products/**",
                                "/api/v1/categories/**",
                                "/api/v1/brands/**",
                                "/api/v1/public/**",
                                "/api/v1/public/inventory/**"
                        ).permitAll()

                        // Giỏ hàng (Cho phép Guest tạo giỏ hàng - tùy logic nghiệp vụ)
                        .requestMatchers("/api/v1/cart/**", "/api/v1/user/cart/**").permitAll()

                        // --- B. USER ENDPOINTS (CẦN LOGIN - ROLE: CUSTOMER) ---
                        .requestMatchers("/api/v1/orders/**").authenticated()
                        .requestMatchers("/api/v1/user/wishlist/**", "/api/v1/user/profile/**", "/api/v1/user/reviews/**").authenticated()

                        // --- C. ADMIN ENDPOINTS (RBAC - PHÂN QUYỀN CHẶT CHẼ) ---

                        // 1. Dashboard & Reports
                        .requestMatchers("/api/v1/admin/dashboard/**", "/api/v1/admin/reports/**")
                        .hasAnyAuthority("SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER")

                        // 2. Quản lý Users (Chỉ Admin cấp cao)
                        .requestMatchers("/api/v1/admin/users/**")
                        .hasAnyAuthority("SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN")

                        // 3. Quản lý Sản phẩm, Danh mục, Thương hiệu
                        .requestMatchers("/api/v1/admin/products/**", "/api/v1/admin/categories/**", "/api/v1/admin/brands/**")
                        .hasAnyAuthority("PRODUCT_MANAGER", "SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN")

                        // 4. Quản lý Đơn hàng
                        .requestMatchers("/api/v1/admin/orders/**")
                        .hasAnyAuthority("ORDER_MANAGER", "SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN")

                        // 5. Quản lý Kho (Inventory)
                        .requestMatchers("/api/v1/admin/inventory/**")
                        .hasAnyAuthority("PRODUCT_MANAGER", "SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN")

                        // 6. Quản lý Mã giảm giá (Coupons)
                        .requestMatchers("/api/v1/admin/coupons/**")
                        .hasAnyAuthority("SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN", "MARKETING")

                        // 7. CMS & Banners (Marketing)
                        .requestMatchers("/api/v1/admin/cms/**", "/api/v1/admin/banners/**")
                        .hasAnyAuthority("MARKETING", "SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN")

                        // Quyền Admin chung (Fallback cho các API admin khác chưa định nghĩa cụ thể)
                        .requestMatchers("/api/v1/admin/**")
                        .hasAnyAuthority("SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN")

                        // --- D. CÁC REQUEST CÒN LẠI ---
                        .anyRequest().authenticated()
                )

                // 5. Provider & Filters
                .userDetailsService(userDetailsService)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}