package com.example.fashion.config;

import com.example.fashion.security.JwtAuthenticationFilter;
import com.example.fashion.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;

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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // 1. CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. API công khai
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/admin/auth/**").permitAll()

                        // 3. Xem sản phẩm, danh mục...
                        .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/brands/**").permitAll()

                        // 4. Giỏ hàng
                        .requestMatchers("/api/v1/user/cart/**").permitAll()
                        .requestMatchers("/api/v1/cart/**").permitAll()

                        // QUAN TRỌNG: ĐẶT DÒNG NÀY TRƯỚC /api/v1/admin/** !!!
                        .requestMatchers(HttpMethod.POST, "/api/v1/user/reviews", "/api/v1/user/reviews/**").authenticated()

                        // QUẢN TRỊ VIÊN – ĐẶT SAU ĐỂ KHÔNG BỊ MATCH NHẦM
                        .requestMatchers("/api/v1/admin/products/**").hasAnyRole("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/categories/**").hasAnyRole("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/brands/**").hasAnyRole("PRODUCT_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/orders/**").hasAnyRole("ORDER_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/users/**").hasRole("SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/dashboard/stats").hasAnyRole("PRODUCT_MANAGER", "ORDER_MANAGER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/reports/**").hasAnyRole("SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER")
                        .requestMatchers("/api/v1/admin/inventory/**").hasAnyRole("SUPER_ADMIN", "PRODUCT_MANAGER")
                        .requestMatchers("/api/v1/admin/cms/**").hasAnyRole("SUPER_ADMIN", "MARKETING")
                        .requestMatchers("/api/v1/admin/banners/**").hasAnyRole("SUPER_ADMIN", "MARKETING")
                        .requestMatchers("/api/v1/admin/**").hasAnyRole("SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER", "MARKETING")

                        // Tất cả còn lại
                        .anyRequest().authenticated()
                )

                .userDetailsService(userDetailsService)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}