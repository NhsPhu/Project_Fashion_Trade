package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter; // <-- Đảm bảo bạn có @Setter
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "products")
@Getter
@Setter // <-- LỖI SẼ BIẾN MẤT NẾU CÓ DÒNG NÀY
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "slug", unique = true, length = 255)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "default_image")
    private String defaultImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "status", length = 50)
    private String status;

    // CÁC TRƯỜNG BỊ THIẾU NẰM Ở ĐÂY
    @Column(name = "seo_meta_title")
    private String seoMetaTitle; // <-- @Setter sẽ tạo ra setSeoMetaTitle()

    @Column(name = "seo_meta_desc")
    private String seoMetaDesc; // <-- @Setter sẽ tạo ra setSeoMetaDesc()

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductVariant> variants;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductImage> images;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}