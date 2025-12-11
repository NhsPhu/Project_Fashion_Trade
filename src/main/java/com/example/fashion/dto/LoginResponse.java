// File: dto/LoginResponse.java (CẬP NHẬT HOÀN CHỈNH)
package com.example.fashion.dto;

import lombok.*;

<<<<<<< HEAD
@Getter
@Setter
@Builder            // Hỗ trợ .builder() cho AuthService
@AllArgsConstructor // Tạo constructor có tất cả tham số
@NoArgsConstructor  // Tạo constructor rỗng
=======
@Getter @Setter
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
public class LoginResponse {

    // Chúng ta thống nhất dùng tên là 'token' thay vì 'accessToken' cho gọn và khớp với AuthService
    private String token;

    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer";
    private Object user; // ← Admin: AdminUserDTO, Customer: null

<<<<<<< HEAD
    // Constructor phụ để hỗ trợ code cũ nếu cần (nhận vào 1 chuỗi token)
    public LoginResponse(String token) {
        this.token = token;
=======
    // Constructor cho Customer
    public LoginResponse(String accessToken) {
        this.accessToken = accessToken;
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    }

    // Constructor cho Admin (trả thêm user)
    public LoginResponse(String accessToken, Object user) {
        this.accessToken = accessToken;
        this.user = user;
    }
}