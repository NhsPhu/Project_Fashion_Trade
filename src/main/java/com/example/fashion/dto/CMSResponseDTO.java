package com.example.fashion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO trả về cho client
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CMSResponseDTO {
    private Long id;
    private String title;
    private String slug;
    private String content;
    private String metaTitle;
    private String metaDescription;
    private String metaKeywords;
    private String ogImage;
    private boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
