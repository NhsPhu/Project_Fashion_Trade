package com.example.fashion.controller;

import com.example.fashion.dto.UserResponseDTO;
import com.example.fashion.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // 1. Import
import org.springframework.security.core.context.SecurityContextHolder; // 2. Import
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users") // (API này đã được bảo vệ bởi SecurityConfig)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * API Lấy thông tin của người dùng đang đăng nhập
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser() {
        // 3. Lấy thông tin xác thực (email) từ Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        // 4. Gọi service để tìm user
        UserResponseDTO userDTO = userService.getUserByEmail(userEmail);
        return ResponseEntity.ok(userDTO);
    }

    // (Bạn có thể thêm API /me/profile (PUT), /me/orders (GET) ở đây sau)
}