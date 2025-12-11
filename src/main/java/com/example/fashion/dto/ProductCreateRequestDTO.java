// src/main/java/com/example/fashion/dto/ProductCreateRequestDTO.java
package com.example.fashion.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@SuperBuilder(toBuilder = true) // DÙNG @SuperBuilder
public class ProductCreateRequestDTO {

    private String name;
    private String slug;
    private String description;
    private String shortDescription;
    private String status;
    private String defaultImage;
    private String seoMetaTitle;
    private String seoMetaDesc;

    private Long categoryId;
    private Long brandId;

    private List<ProductVariantRequestDTO> variants;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
    public static class ProductVariantRequestDTO {
        private String sku;
        private String attributes;
        private BigDecimal price;
        private BigDecimal salePrice;
        private Integer stockQuantity;
        private Double weight;
    }
}