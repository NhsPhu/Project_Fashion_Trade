package com.example.fashion.config;

import com.example.fashion.security.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Bean
    public JwtTokenProvider jwtTokenProvider() {
        // Tường minh tạo ra MỘT instance duy nhất của JwtTokenProvider
        return new JwtTokenProvider();
    }
}
