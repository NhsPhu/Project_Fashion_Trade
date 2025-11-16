package com.example.fashion.config;

// (Hãy đảm bảo các import này chính xác)
import com.example.fashion.security.JwtAuthenticationFilter;
import com.example.fashion.service.CustomUserDetailsService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // (Import quan trọng)
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// 1. THÊM IMPORT NÀY
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
// 2. THÊM DÒNG NÀY (Để kích hoạt @PreAuthorize trong Controller)
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtFilter;

    // (Constructor Injection)
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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Phân quyền truy cập
                .authorizeHttpRequests(auth -> auth

                        // 1. Cho phép TẤT CẢ các yêu cầu OPTIONS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Cho phép API Đăng nhập/Đăng ký CÔNG KHAI
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // 3. Cho phép API đăng nhập ADMIN
                        .requestMatchers("/api/v1/admin/auth/**").permitAll()

                        // 4. Cho phép các API CÔNG KHAI (Xem sản phẩm, ...)
                        .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/brands/**").permitAll()

                        // 5. Cho phép API giỏ hàng (Hỗ trợ khách vãng lai)
                        .requestMatchers("/api/v1/user/cart/**").permitAll()
                        .requestMatchers("/api/v1/cart/**").permitAll()

                        // 6. SỬA LỖI: DÙNG hasAnyRole (Tự thêm 'ROLE_')
                        .requestMatchers("/api/v1/admin/products/**").hasAnyRole("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/categories/**").hasAnyRole("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/brands/**").hasAnyRole("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/orders/**").hasAnyRole("ORDER_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/users/**").hasRole("SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/dashboard/stats").hasAnyRole("PRODUCT_MANAGER", "ORDER_MANAGER", "SUPER_ADMIN")

                        // 7. THÊM RULES CÒN THIẾU (Cho các API Báo cáo và Kho)
                        .requestMatchers("/api/v1/admin/reports/**").hasAnyRole("SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER")
                        .requestMatchers("/api/v1/admin/inventory/**").hasAnyRole("SUPER_ADMIN", "PRODUCT_MANAGER")

                        // 8. SỬA LỖI: Quy tắc chung cho admin
                        .requestMatchers("/api/v1/admin/**").hasAnyRole("SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER")

                        // 9. Bất kỳ yêu cầu nào khác (ví dụ: /user/profile) đều cần đăng nhập
                        .anyRequest().authenticated()
                )

                .userDetailsService(userDetailsService)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}