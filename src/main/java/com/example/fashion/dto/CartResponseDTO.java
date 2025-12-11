package com.example.fashion.dto;

import com.example.fashion.entity.Cart;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class CartResponseDTO {
    private Long id;
    private Set<CartItemResponseDTO> items;
    private BigDecimal totalAmount;
    private Integer totalItems;
    private LocalDateTime createdAt;
    private String sessionId;

    /**
     * Tạo DTO từ Cart entity
     */
    public static CartResponseDTO fromCart(Cart cart) {
        CartResponseDTO dto = new CartResponseDTO();
        dto.setId(cart.getId());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setSessionId(cart.getSessionId());

        if (cart.getItems() != null && !cart.getItems().isEmpty()) {
            dto.setItems(cart.getItems().stream()
                    .map(CartItemResponseDTO::fromCartItem)
                    .collect(Collectors.toSet()));

            BigDecimal total = dto.getItems().stream()
                    .map(item -> item.getSubtotal() != null ? item.getSubtotal() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dto.setTotalAmount(total);

            dto.setTotalItems(dto.getItems().stream()
                    .mapToInt(CartItemResponseDTO::getQuantity)
                    .sum());
        } else {
            dto.setItems(Collections.emptySet());
            dto.setTotalAmount(BigDecimal.ZERO);
            dto.setTotalItems(0);
        }

        return dto;
    }

    /**
     * Tạo giỏ hàng rỗng (khi chưa có cart)
     */
    public static CartResponseDTO empty() {
        CartResponseDTO dto = new CartResponseDTO();
        dto.setItems(Collections.emptySet());
        dto.setTotalAmount(BigDecimal.ZERO);
        dto.setTotalItems(0);
        return dto;
    }
}