// src/main/java/com/example/fashion/dto/ProductResponseDTO.java
package com.example.fashion.dto;

import com.example.fashion.entity.Product;
import com.example.fashion.entity.ProductVariant;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductResponseDTO {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String shortDescription;
    private String status;
    private String defaultImage;
    private String seoMetaTitle;
    private String seoMetaDesc;

    private Long categoryId;
    private String categoryName;
    private Long brandId;
    private String brandName;

    private BigDecimal price; // THÊM: lấy từ variant đầu tiên
    private String sku; // THÊM: lấy từ variant đầu tiên
    private List<VariantDTO> variants;

    public static ProductResponseDTO fromProduct(Product product) {
        ProductResponseDTO dto = ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .shortDescription(product.getShortDescription())
                .status(product.getStatus())
                .defaultImage(product.getDefaultImage())
                .seoMetaTitle(product.getSeoMetaTitle())
                .seoMetaDesc(product.getSeoMetaDesc())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .variants(product.getVariants() != null
                        ? product.getVariants().stream()
                        .map(VariantDTO::fromEntity)
                        .toList()
                        : null)
                .build();

        // SỬA: Lấy price & sku từ variant đầu tiên
        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            VariantDTO firstVariant = dto.getVariants().get(0);
            dto.setPrice(firstVariant.getPrice());
            dto.setSku(firstVariant.getSku());
        }

        return dto;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class VariantDTO {
        private Long id;
        private String sku;
        private String attributes;
        private BigDecimal price;
        private BigDecimal salePrice;
        private Integer stockQuantity;
        private Double weight;

        public static VariantDTO fromEntity(ProductVariant v) {
            if (v == null) return null;
            return VariantDTO.builder()
                    .id(v.getId())
                    .sku(v.getSku())
                    .attributes(v.getAttributes())
                    .price(v.getPrice())
                    .salePrice(v.getSalePrice())
                    .stockQuantity(v.getStockQuantity())
                    .weight(v.getWeight())
                    .build();
        }
    }
}