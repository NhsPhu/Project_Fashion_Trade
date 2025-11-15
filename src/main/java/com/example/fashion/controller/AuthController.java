package com.example.fashion.controller;

import com.example.fashion.dto.CustomerRegisterRequestDTO;
import com.example.fashion.dto.LoginRequest;
import com.example.fashion.dto.LoginResponse;
import com.example.fashion.dto.RegisterAdminRequest;
import com.example.fashion.entity.User;
import com.example.fashion.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            String jwt = authService.loginUser(loginRequest);
            return ResponseEntity.ok(new LoginResponse(jwt));
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody CustomerRegisterRequestDTO request) {
        try {
            User customer = authService.registerCustomer(request);
            return ResponseEntity.ok("Đăng ký khách hàng thành công: " + customer.getEmail());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/admin/register")
    public ResponseEntity<?> registerSuperAdmin(@RequestBody RegisterAdminRequest request) {
        try {
            User adminUser = authService.registerSuperAdmin(request);
            return ResponseEntity.ok("Tạo SUPER_ADMIN thành công cho: " + adminUser.getEmail());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}