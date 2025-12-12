package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
public class ProductUpdateRequestDTO {
    // Thông tin Product
    private String name;
    private String slug;
    private String description;
    private String status; // "Draft", "Published", "Archived"
    private String defaultImage;

    // ID của Category và Brand
    private Long categoryId;
    private Long brandId;

    // Thông tin SEO
    private String seoMetaTitle;
    private String seoMetaDesc;

    // Yêu cầu (Mục 4.2): Quản lý variants (SKU), hình ảnh (multi), giá
    // Khi cập nhật, chúng ta sẽ xóa các variant/image cũ và thêm các variant/image mới
    // Đây là cách làm đơn giản nhất (thay vì so sánh cái nào thêm/sửa/xóa)

    private Set<ProductVariantRequestDTO> variants;
    private Set<ProductImageRequestDTO> images;
}