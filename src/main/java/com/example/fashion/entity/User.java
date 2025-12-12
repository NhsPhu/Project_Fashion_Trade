package com.example.fashion.entity;

import com.example.fashion.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users") // Ánh xạ tới bảng 'users'
@Getter // Tự động tạo tất cả các hàm get (ví dụ: getEmail(), getRoles())
@Setter // Tự động tạo tất cả các hàm set (ví dụ: setEmail(), setRoles())
@NoArgsConstructor // Tự động tạo constructor rỗng
@AllArgsConstructor // Tự động tạo constructor với tất cả các trường
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID tự động tăng
    private Long id;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash; // Lưu mật khẩu đã băm

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "phone", length = 20)
    private String phone;

    // Cập nhật từ bước trước: Sử dụng ElementCollection cho Roles
    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING) // Lưu tên của Enum (ví dụ: "SUPER_ADMIN")
    @Column(name = "role", nullable = false)
    private Set<Role> roles;

    @Column(name = "status", length = 20)
    private String status; // Ví dụ: "active", "locked"

    @Column(name = "email_verified")
    private boolean emailVerified;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Định nghĩa mối quan hệ: Một User có thể có nhiều Address
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Address> addresses;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}