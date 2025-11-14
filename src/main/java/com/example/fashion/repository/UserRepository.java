// src/main/java/com/example/fashion/repository/UserRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.User;
import com.example.fashion.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;  // ← THÊM IMPORT
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>,
        JpaSpecificationExecutor<User> {  // ← THÊM , JpaSpecificationExecutor<User>

    Optional<User> findByEmail(String email);
    long countByRolesContains(Role role);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<User> findByRolesContaining(Role role);
}