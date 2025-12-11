<<<<<<< HEAD
// src/main/java/com/example/fashion/controller/WishlistController.java
=======
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
package com.example.fashion.controller;

import com.example.fashion.dto.ProductPublicResponseDTO;
import com.example.fashion.security.SecurityUtils;
import com.example.fashion.service.WishlistService;
<<<<<<< HEAD
import org.springframework.http.HttpStatus;
=======
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
<<<<<<< HEAD
@RequestMapping("/api/v1/user/wishlist") // ← Quan trọng: phải đúng với frontend /user/wishlist
=======
@RequestMapping("/api/v1/user/wishlist")
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
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

<<<<<<< HEAD
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
=======
    @PostMapping("/{productId}")
    public ResponseEntity<Void> addToWishlist(@PathVariable Long productId) {
        wishlistService.addToWishlist(requireUser(), productId);
        return ResponseEntity.ok().build();
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(requireUser(), productId);
        return ResponseEntity.noContent().build();
    }
}