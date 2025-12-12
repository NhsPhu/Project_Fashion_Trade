package com.example.fashion.dto;

import com.example.fashion.entity.Product;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String status;
    private String defaultImage;
    private String seoMetaTitle;
    private String seoMetaDesc;
    private LocalDateTime createdAt;

    // Thông tin lồng nhau
    private Long categoryId;
    private String categoryName;
    private Long brandId;
    private String brandName;

    private Set<ProductVariantResponseDTO> variants;
    private Set<ProductImageResponseDTO> images;

    /**
     * Phương thức chuyển đổi (Converter) từ Entity sang DTO
     */
    public static ProductResponseDTO fromProduct(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setStatus(product.getStatus());
        dto.setDefaultImage(product.getDefaultImage());
        dto.setSeoMetaTitle(product.getSeoMetaTitle());
        dto.setSeoMetaDesc(product.getSeoMetaDesc());
        dto.setCreatedAt(product.getCreatedAt());

        // Lấy thông tin Category
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }

        // Lấy thông tin Brand
        if (product.getBrand() != null) {
            dto.setBrandId(product.getBrand().getId());
            dto.setBrandName(product.getBrand().getName());
        }

        // Chuyển đổi danh sách Variants
        if (product.getVariants() != null) {
            dto.setVariants(product.getVariants().stream()
                    .map(ProductVariantResponseDTO::fromProductVariant)
                    .collect(Collectors.toSet()));
        }

        // Chuyển đổi danh sách Images
        if (product.getImages() != null) {
            dto.setImages(product.getImages().stream()
                    .map(ProductImageResponseDTO::fromProductImage)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}