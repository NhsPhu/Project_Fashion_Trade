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
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// --- THÊM CÁC IMPORT NÀY ĐỂ SỬA LỖI CORS ---
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
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
     * --- [SỬA LỖI 1] CẤU HÌNH CORS ---
     * Cho phép React (localhost:3000) gọi API mà không bị chặn
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Cho phép Frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // Kích hoạt CORS dùng Bean bên trên
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // 1. Tài nguyên tĩnh
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/product_image/**", "/uploads/**", "/css/**", "/js/**", "/images/**").permitAll()

                        // 2. Auth Public
                        .requestMatchers("/api/v1/auth/admin/register").permitAll()
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/admin/auth/**").permitAll()

                        // 3. Public GET
                        .requestMatchers(HttpMethod.GET, "/api/v1/products/**", "/api/v1/public/products/**", "/api/v1/categories/**", "/api/v1/brands/**").permitAll()

                        // 4. User actions (Giỏ hàng)
                        .requestMatchers("/api/v1/user/cart/**", "/api/v1/cart/**").permitAll()
                        .requestMatchers("/api/v1/user/wishlist/**", "/api/v1/user/reviews/**").authenticated()

                        // --- [SỬA LỖI 2] THÊM ROLE_SUPER_ADMIN VÀO TẤT CẢ CÁC MỤC ---

                        // Dashboard
                        .requestMatchers("/api/v1/admin/dashboard/stats")
                        .hasAnyAuthority("PRODUCT_MANAGER", "ORDER_MANAGER", "SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN")

                        // Users (Nguyên nhân chính gây lỗi 403 của bạn)
                        .requestMatchers("/api/v1/admin/users/**")
                        .hasAnyAuthority("SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN")

                        // Các mục khác
                        .requestMatchers("/api/v1/admin/products/**", "/api/v1/admin/categories/**", "/api/v1/admin/brands/**")
                        .hasAnyAuthority("PRODUCT_MANAGER", "SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN")

                        .requestMatchers("/api/v1/admin/orders/**")
                        .hasAnyAuthority("ORDER_MANAGER", "SUPER_ADMIN", "ROLE_SUPER_ADMIN", "ADMIN", "ROLE_ADMIN")

                        .requestMatchers("/api/v1/admin/reports/**")
                        .hasAnyAuthority("SUPER_ADMIN", "ROLE_SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER", "ADMIN", "ROLE_ADMIN")

                        .requestMatchers("/api/v1/admin/inventory/**")
                        .hasAnyAuthority("SUPER_ADMIN", "ROLE_SUPER_ADMIN", "PRODUCT_MANAGER", "ADMIN", "ROLE_ADMIN")

                        .requestMatchers("/api/v1/admin/cms/**", "/api/v1/admin/banners/**")
                        .hasAnyAuthority("SUPER_ADMIN", "ROLE_SUPER_ADMIN", "MARKETING", "ADMIN", "ROLE_ADMIN")

                        // Quyền chung
                        .requestMatchers("/api/v1/admin/**")
                        .hasAnyAuthority("SUPER_ADMIN", "ROLE_SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER", "MARKETING", "ADMIN", "ROLE_ADMIN")

                        .anyRequest().authenticated()
                )
                .userDetailsService(userDetailsService)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}