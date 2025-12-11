// src/main/java/com/example/fashion/controller/AdminCouponController.java
package com.example.fashion.controller;

import com.example.fashion.dto.CouponRequestDTO;
import com.example.fashion.dto.CouponResponseDTO;
import com.example.fashion.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/coupons")
@RequiredArgsConstructor
<<<<<<< HEAD
@PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'ADMIN')")
=======
@PreAuthorize("hasRole('SUPER_ADMIN') OR hasRole('ADMIN')")
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
public class AdminCouponController {

    private final CouponService couponService;

    @PostMapping
    public ResponseEntity<CouponResponseDTO.Success> createCoupon(
            @Valid @RequestBody CouponRequestDTO request) {
        return ResponseEntity.ok(couponService.createCoupon(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CouponResponseDTO.Success> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponRequestDTO request) {
        return ResponseEntity.ok(couponService.updateCoupon(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CouponResponseDTO.Success> deleteCoupon(@PathVariable Long id) {
        return ResponseEntity.ok(couponService.deleteCoupon(id));
    }

    @GetMapping
    public ResponseEntity<List<CouponResponseDTO>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CouponResponseDTO> getCouponById(@PathVariable Long id) {
        return ResponseEntity.ok(couponService.getCouponById(id));
    }
}