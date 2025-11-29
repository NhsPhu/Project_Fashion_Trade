package com.example.fashion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dùng cho request tạo / cập nhật trang CMS
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CMSRequestDTO {
    private String title;
    private String slug;
    private String content;
    private String metaTitle;
    private String metaDescription;
    private String metaKeywords;
    private String ogImage;
    private boolean published;
}
