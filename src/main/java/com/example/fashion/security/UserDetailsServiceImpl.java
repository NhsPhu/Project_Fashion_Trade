package com.example.fashion.security;

import com.example.fashion.dto.UpdateUserRolesRequest;
import com.example.fashion.dto.UpdateUserStatusRequest;
import com.example.fashion.dto.UserResponseDTO;
import com.example.fashion.entity.User;
import com.example.fashion.enums.Role;
import com.example.fashion.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponseDTO::fromUser)
                .collect(Collectors.toList());
    }

    public UserResponseDTO updateUserStatus(Long userId, UpdateUserStatusRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        user.setStatus(request.getStatus());

        User updatedUser = userRepository.save(user);

        return UserResponseDTO.fromUser(updatedUser);
    }

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
}