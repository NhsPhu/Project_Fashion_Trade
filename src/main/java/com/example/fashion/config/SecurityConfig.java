package com.example.fashion.config;

// (Hãy đảm bảo các import này chính xác)
import com.example.fashion.security.JwtAuthenticationFilter;
import com.example.fashion.service.CustomUserDetailsService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // (Import quan trọng)
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
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

                // 1. Kích hoạt cấu hình CORS (để nó đọc WebConfig.java)
                .cors(cors -> cors.configure(http))

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Phân quyền truy cập
                .authorizeHttpRequests(auth -> auth

                        // 2. Cho phép TẤT CẢ các yêu cầu OPTIONS (để fix lỗi CORS 403)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 3. Cho phép API Đăng nhập/Đăng ký
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // 4. Cho phép các API CÔNG KHAI (User/Customer)
                        .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/brands/**").permitAll()

                        // (Fix lỗi 403 khi tải giỏ hàng/yêu thích)
                        .requestMatchers("/api/v1/user/cart/**").permitAll()
                        .requestMatchers("/api/v1/cart/**").permitAll()
                        .requestMatchers("/api/v1/user/wishlist/**").permitAll()

                        // 5. ADMIN ENDPOINTS (Phải có Role)
                        // (Sửa lỗi logic: Các quy tắc CỤ THỂ phải ở trên quy tắc CHUNG)
                        .requestMatchers("/api/v1/admin/products/**").hasAnyAuthority("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/categories/**").hasAnyAuthority("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/brands/**").hasAnyAuthority("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/orders/**").hasAnyAuthority("ORDER_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/users/**").hasAuthority("SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/dashboard/stats").hasAnyAuthority("PRODUCT_MANAGER", "ORDER_MANAGER", "SUPER_ADMIN")

                        // (Sửa lỗi: Bỏ "ROLE_")
                        .requestMatchers("/api/v1/admin/**").hasAnyAuthority("SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER")

                        // 6. Bất kỳ yêu cầu nào khác (ví dụ: /profile) đều cần đăng nhập
                        .anyRequest().authenticated()
                )

                .userDetailsService(userDetailsService)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}