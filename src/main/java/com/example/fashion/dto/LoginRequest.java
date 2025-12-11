package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String email;
    private String password;
    private String totpCode; // ← DÙNG CHO ADMIN 2FA (Customer bỏ trống)
}