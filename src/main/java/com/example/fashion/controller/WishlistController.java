// src/main/java/com/example/fashion/controller/WishlistController.java
package com.example.fashion.controller;

import com.example.fashion.dto.ProductPublicResponseDTO;
import com.example.fashion.security.SecurityUtils;
import com.example.fashion.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/wishlist") // ← Quan trọng: phải đúng với frontend /user/wishlist
public class WishlistController {

    private final WishlistService wishlistService;
    private final SecurityUtils securityUtils;

    public WishlistController(WishlistService wishlistService,
                              SecurityUtils securityUtils) {
        this.wishlistService = wishlistService;
        this.securityUtils = securityUtils;
    }

    private Long requireUser() {
        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Chưa đăng nhập");
        }
        return userId;
    }

    @GetMapping
    public ResponseEntity<List<ProductPublicResponseDTO>> getWishlist() {
        return ResponseEntity.ok(wishlistService.getWishlistProducts(requireUser()));
    }

    // ĐÃ SỬA HOÀN CHỈNH
    @PostMapping("/{productId}")
    public ResponseEntity<String> addToWishlist(@PathVariable Long productId) {
        Long userId = requireUser();

        if (wishlistService.isProductInWishlist(userId, productId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("ALREADY_IN_WISHLIST");
        }

        wishlistService.addToWishlist(userId, productId);
        return ResponseEntity.ok("ADDED_TO_WISHLIST");
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(requireUser(), productId);
        return ResponseEntity.noContent().build();
    }
}