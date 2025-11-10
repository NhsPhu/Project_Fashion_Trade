package com.example.fashion.repository;

import com.example.fashion.entity.User;
import com.example.fashion.enums.Role; // 1. Import Role
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // 2. THÊM HÀM MỚI (Đếm số user theo vai trò)
    long countByRolesContains(Role role);
}