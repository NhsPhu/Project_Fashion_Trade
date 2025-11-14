package com.example.fashion.dto;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long variantId; // ID của ProductVariant
    private Integer quantity;   // Số lượng
}