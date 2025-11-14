package com.example.fashion.controller;

import com.example.fashion.dto.CartItemRequestDTO;
import com.example.fashion.dto.CartResponseDTO;
import com.example.fashion.security.SecurityUtils;
import com.example.fashion.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user/cart")
public class CartController {

    private final CartService cartService;
    private final SecurityUtils securityUtils;

    public CartController(CartService cartService, SecurityUtils securityUtils) {
        this.cartService = cartService;
        this.securityUtils = securityUtils;
    }

    private Long currentUserId() {
        return securityUtils.getCurrentUserId();
    }

    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(@RequestParam(value = "sessionId", required = false) String sessionId) {
        Long userId = currentUserId();
        return ResponseEntity.ok(cartService.getCart(userId, sessionId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponseDTO> addItem(@RequestParam(value = "sessionId", required = false) String sessionId,
                                                   @RequestBody CartItemRequestDTO request) {
        Long userId = currentUserId();
        return ResponseEntity.ok(cartService.addItem(userId, sessionId, request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponseDTO> updateItem(@RequestParam(value = "sessionId", required = false) String sessionId,
                                                      @PathVariable Long itemId,
                                                      @RequestBody CartItemRequestDTO request) {
        Long userId = currentUserId();
        return ResponseEntity.ok(cartService.updateItem(userId, sessionId, itemId, request.getQuantity()));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponseDTO> removeItem(@RequestParam(value = "sessionId", required = false) String sessionId,
                                                      @PathVariable Long itemId) {
        Long userId = currentUserId();
        return ResponseEntity.ok(cartService.removeItem(userId, sessionId, itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestParam(value = "sessionId", required = false) String sessionId) {
        Long userId = currentUserId();
        cartService.clearCart(userId, sessionId);
        return ResponseEntity.noContent().build();
    }
}