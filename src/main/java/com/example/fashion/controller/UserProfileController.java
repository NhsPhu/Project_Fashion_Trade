package com.example.fashion.controller;

import com.example.fashion.dto.*;
import com.example.fashion.security.SecurityUtils;
import com.example.fashion.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final SecurityUtils securityUtils;

    public UserProfileController(UserProfileService userProfileService,
                                 SecurityUtils securityUtils) {
        this.userProfileService = userProfileService;
        this.securityUtils = securityUtils;
    }

    private Long requireUserId() {
        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Chưa đăng nhập");
        }
        return userId;
    }

    @GetMapping
    public ResponseEntity<ProfileResponseDTO> getProfile() {
        return ResponseEntity.ok(userProfileService.getProfile(requireUserId()));
    }

    @PutMapping
    public ResponseEntity<ProfileResponseDTO> updateProfile(@RequestBody ProfileUpdateRequestDTO request) {
        return ResponseEntity.ok(userProfileService.updateProfile(requireUserId(), request));
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressResponseDTO>> getAddresses() {
        return ResponseEntity.ok(userProfileService.getAddresses(requireUserId()));
    }

    @PostMapping("/addresses")
    public ResponseEntity<AddressResponseDTO> addAddress(@RequestBody AddressRequestDTO request) {
        return ResponseEntity.ok(userProfileService.addAddress(requireUserId(), request));
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<AddressResponseDTO> updateAddress(@PathVariable Long addressId,
                                                            @RequestBody AddressRequestDTO request) {
        return ResponseEntity.ok(userProfileService.updateAddress(requireUserId(), addressId, request));
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long addressId) {
        userProfileService.deleteAddress(requireUserId(), addressId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/activity")
    public ResponseEntity<Map<String, Object>> getActivity() {
        return ResponseEntity.ok(userProfileService.getActivityHistory(requireUserId()));
    }
}



