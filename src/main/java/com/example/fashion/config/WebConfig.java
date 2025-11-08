package com.example.fashion.config; // Đảm bảo đúng package của bạn

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Áp dụng cho tất cả API bắt đầu bằng /api/
                .allowedOrigins("http://localhost:3000") // Cho phép máy chủ React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các phương thức
                .allowedHeaders("*") // Cho phép tất cả các header
                .allowCredentials(true);
    }
}