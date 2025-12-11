// src/main/java/com/example/fashion/dto/ProductVariantRequestDTO.java
package com.example.fashion.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductVariantRequestDTO {
    private String sku;
    private String attributes;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Double weight;
}