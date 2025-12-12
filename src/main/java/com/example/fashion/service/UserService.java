package com.example.fashion.service;

import com.example.fashion.dto.UpdateUserRolesRequest;
import com.example.fashion.dto.UpdateUserStatusRequest;
import com.example.fashion.dto.UserResponseDTO;
import com.example.fashion.entity.User;
import com.example.fashion.enums.Role;
import com.example.fashion.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// File này giữ nguyên là @Service chính (tên bean mặc định là userService)
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ========== HÀM MỚI (Dùng cho User/Profile) ==========
    @Transactional(readOnly = true)
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));
        return UserResponseDTO.fromUser(user);
    }
    // ===================================================

    // ========== CÁC HÀM CŨ (Dùng cho Admin) ==========

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponseDTO::fromUser)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDTO updateUserStatus(Long userId, UpdateUserStatusRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
        user.setStatus(request.getStatus());
        User updatedUser = userRepository.save(user);
        return UserResponseDTO.fromUser(updatedUser);
    }

    @Transactional
    public UserResponseDTO updateUserRoles(Long userId, UpdateUserRolesRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        Set<Role> newRoles = request.getRoles().stream()
                .map(roleName -> {
                    try {
                        return Role.valueOf(roleName.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Vai trò không hợp lệ: " + roleName);
                    }
                })
                .collect(Collectors.toSet());

        user.setRoles(newRoles);
        User updatedUser = userRepository.save(user);
        return UserResponseDTO.fromUser(updatedUser);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
        return UserResponseDTO.fromUser(user);
    }
}