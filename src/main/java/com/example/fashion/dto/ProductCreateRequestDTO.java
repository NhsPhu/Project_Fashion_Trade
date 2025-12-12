package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
public class ProductCreateRequestDTO {
    // Thông tin Product
    private String name;
    private String slug;
    private String description;
    private String status; // "Draft", "Published"
    private String defaultImage;

    // ID của Category và Brand
    private Long categoryId;
    private Long brandId;

    // Thông tin SEO
    private String seoMetaTitle;
    private String seoMetaDesc;

    // Danh sách các biến thể
    private Set<ProductVariantRequestDTO> variants;

    // Danh sách các hình ảnh
    private Set<ProductImageRequestDTO> images;
}