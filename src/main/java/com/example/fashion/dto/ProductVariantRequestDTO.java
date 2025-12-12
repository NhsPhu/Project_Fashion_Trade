package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class ProductVariantRequestDTO {
    private String sku;
    // JSON: {"color": "Red", "size": "L"}
    private String attributes;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Double weight;
}