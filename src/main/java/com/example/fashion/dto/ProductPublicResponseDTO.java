// src/main/java/com/example/fashion/dto/ProductPublicResponseDTO.java
package com.example.fashion.dto;

import com.example.fashion.entity.Product;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductPublicResponseDTO {
    private Long id;
    private String name;
    private String slug;
    private String defaultImage;
    private BigDecimal minPrice;
    private BigDecimal minSalePrice;
    private Double averageRating;
    private Integer reviewCount;

    // ĐÃ ĐỔI TÊN: from() → fromProduct()
    public static ProductPublicResponseDTO fromProduct(Product product) {
        ProductPublicResponseDTO dto = new ProductPublicResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDefaultImage(product.getDefaultImage());

        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            dto.setMinPrice(product.getVariants().stream()
                    .map(v -> v.getPrice() != null ? v.getPrice() : BigDecimal.ZERO)
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO));

            dto.setMinSalePrice(product.getVariants().stream()
                    .map(v -> v.getSalePrice() != null ? v.getSalePrice() : BigDecimal.ZERO)
                    .filter(p -> p.compareTo(BigDecimal.ZERO) > 0)
                    .min(BigDecimal::compareTo)
                    .orElse(null));
        }

        return dto;
    }
}