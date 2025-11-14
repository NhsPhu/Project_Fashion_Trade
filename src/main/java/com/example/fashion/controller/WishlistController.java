package com.example.fashion.controller;

import com.example.fashion.dto.ProductPublicResponseDTO;
import com.example.fashion.security.SecurityUtils;
import com.example.fashion.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/wishlist")
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

    @PostMapping("/{productId}")
    public ResponseEntity<Void> addToWishlist(@PathVariable Long productId) {
        wishlistService.addToWishlist(requireUser(), productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(requireUser(), productId);
        return ResponseEntity.noContent().build();
    }
}