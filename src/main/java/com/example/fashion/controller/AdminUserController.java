package com.example.fashion.controller;

import com.example.fashion.dto.UpdateUserRolesRequest;
import com.example.fashion.dto.UpdateUserStatusRequest;
import com.example.fashion.dto.UserResponseDTO;
import com.example.fashion.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // <-- Import mới

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UpdateUserStatusRequest request) {
        try {
            UserResponseDTO updatedUser = userService.updateUserStatus(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{userId}/roles")
    public ResponseEntity<?> updateUserRoles(
            @PathVariable Long userId,
            @RequestBody UpdateUserRolesRequest request) {
        try {
            UserResponseDTO updatedUser = userService.updateUserRoles(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}