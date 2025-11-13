// src/main/java/com/example/fashion/repository/UserRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.User;
import com.example.fashion.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // THIẾU: Đếm user theo role
    long countByRolesContains(Role role);

    // CÁC METHOD ĐÃ CÓ TỪ TRƯỚC
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<User> findByRolesContaining(Role role);
}