// src/main/java/com/example/fashion/repository/UserRepository.java
package com.example.fashion.repository;

import com.example.fashion.dto.CMSRequestDTO;
import com.example.fashion.dto.CMSResponseDTO;
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
<<<<<<< HEAD

    // Đếm số user theo vai trò
    long countByRolesContains(Role role);

    // ========================================================================
    // HÀM MỚI THÊM ĐỂ SỬA LỖI REPORT SERVICE
    // ========================================================================

    // Đếm khách hàng mới đăng ký trong khoảng thời gian
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);


    // (Phần interface cũ của bạn giữ nguyên)
    interface CMSService {
        List<CMSResponseDTO> getAllPages();
        CMSResponseDTO createPage(CMSRequestDTO dto);
        CMSResponseDTO updatePage(Long id, CMSRequestDTO dto);
        void deletePage(Long id);
    }
=======
    long countByRolesContains(Role role);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<User> findByRolesContaining(Role role);
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
}