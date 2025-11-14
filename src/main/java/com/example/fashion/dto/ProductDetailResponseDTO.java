// src/main/java/com/example/fashion/dto/ProductDetailResponseDTO.java
package com.example.fashion.dto;

import com.example.fashion.entity.Product;
import com.example.fashion.entity.Review;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProductDetailResponseDTO {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String technicalSpecs;
    private String defaultImage;
    private String categoryName;
    private String brandName;
    private Set<ProductVariantResponseDTO> variants;
    private Set<ProductImageResponseDTO> images;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal minSalePrice;
    private BigDecimal maxSalePrice;
    private Integer totalStock;
    private Double averageRating;
    private Integer reviewCount;
    private Set<ReviewResponseDTO> reviews;

    public static ProductDetailResponseDTO from(Product product, Set<Review> reviewEntities) {
        ProductDetailResponseDTO dto = new ProductDetailResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setTechnicalSpecs(product.getSeoMetaDesc());
        dto.setDefaultImage(product.getDefaultImage());

        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
        }
        if (product.getBrand() != null) {
            dto.setBrandName(product.getBrand().getName());
        }

        if (product.getVariants() != null) {
            dto.setVariants(product.getVariants().stream()
                    .map(ProductVariantResponseDTO::fromProductVariant)
                    .collect(Collectors.toSet()));

            dto.setTotalStock(product.getVariants().stream()
                    .mapToInt(v -> v.getStockQuantity() != null ? v.getStockQuantity() : 0)
                    .sum());

            dto.setMinPrice(product.getVariants().stream()
                    .map(v -> v.getPrice() != null ? v.getPrice() : BigDecimal.ZERO)
                    .min(BigDecimal::compareTo).orElse(BigDecimal.ZERO));

            dto.setMaxPrice(product.getVariants().stream()
                    .map(v -> v.getPrice() != null ? v.getPrice() : BigDecimal.ZERO)
                    .max(BigDecimal::compareTo).orElse(BigDecimal.ZERO));

            dto.setMinSalePrice(product.getVariants().stream()
                    .map(v -> v.getSalePrice() != null ? v.getSalePrice() : BigDecimal.ZERO)
                    .filter(p -> p.compareTo(BigDecimal.ZERO) > 0)
                    .min(BigDecimal::compareTo).orElse(null));

            dto.setMaxSalePrice(product.getVariants().stream()
                    .map(v -> v.getSalePrice() != null ? v.getSalePrice() : BigDecimal.ZERO)
                    .filter(p -> p.compareTo(BigDecimal.ZERO) > 0)
                    .max(BigDecimal::compareTo).orElse(null));
        }

        // Không có entity ProductImage → trả rỗng, build pass
        dto.setImages(java.util.Set.of());

        // Reviews
        if (reviewEntities != null && !reviewEntities.isEmpty()) {
            dto.setReviewCount(reviewEntities.size());
            double avg = reviewEntities.stream().mapToInt(Review::getRating).average().orElse(0.0);
            dto.setAverageRating(avg);
            dto.setReviews(reviewEntities.stream()
                    .map(ReviewResponseDTO::fromReview)
                    .collect(Collectors.toSet()));
        } else {
            dto.setReviewCount(0);
            dto.setAverageRating(0.0);
            dto.setReviews(Set.of());
        }

        return dto;
    }
}