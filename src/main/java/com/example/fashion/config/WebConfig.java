package com.example.fashion.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 1. Cấu hình CORS (Giữ nguyên của bạn)
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    // 2. Cấu hình đường dẫn ảnh (PHẦN QUAN TRỌNG MỚI THÊM)
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Khi Frontend gọi: http://localhost:8080/product_image/img/ten-anh.jpg
        // Backend sẽ tìm file tại: src/main/resources/static/product_image/img/ten-anh.jpg

        registry.addResourceHandler("/product_image/**")
                .addResourceLocations("classpath:/static/product_image/");
    }
}