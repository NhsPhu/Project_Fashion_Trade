// File: dto/LoginResponse.java (CẬP NHẬT HOÀN CHỈNH)
package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Object user; // ← Admin: AdminUserDTO, Customer: null

    // Constructor cho Customer
    public LoginResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    // Constructor cho Admin (trả thêm user)
    public LoginResponse(String accessToken, Object user) {
        this.accessToken = accessToken;
        this.user = user;
    }
}