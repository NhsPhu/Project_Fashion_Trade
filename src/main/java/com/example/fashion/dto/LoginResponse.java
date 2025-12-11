package com.example.fashion.dto;

import lombok.*;

@Getter
@Setter
@Builder            // Hỗ trợ .builder() cho AuthService
@AllArgsConstructor // Tạo constructor có tất cả tham số
@NoArgsConstructor  // Tạo constructor rỗng
public class LoginResponse {

    // Chúng ta thống nhất dùng tên là 'token' thay vì 'accessToken' cho gọn và khớp với AuthService
    private String token;

    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer";

    // Constructor phụ để hỗ trợ code cũ nếu cần (nhận vào 1 chuỗi token)
    public LoginResponse(String token) {
        this.token = token;
    }
}