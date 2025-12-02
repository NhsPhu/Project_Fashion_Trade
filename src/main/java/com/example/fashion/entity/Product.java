package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
// 1. CHÚ Ý IMPORT SET
import java.util.Set;
import java.util.LinkedHashSet;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
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

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "default_image", length = 500)
    private String defaultImage;

    @Column(name = "seo_meta_title", length = 255)
    private String seoMetaTitle;

    @Column(name = "seo_meta_desc", columnDefinition = "TEXT")
    private String seoMetaDesc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    // 2. SỬA List -> Set (Dùng LinkedHashSet để giữ thứ tự sắp xếp)
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private Set<ProductVariant> variants = new LinkedHashSet<>();

    // 3. SỬA List -> Set (Dùng LinkedHashSet để giữ thứ tự sắp xếp)
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private Set<ProductImage> images = new LinkedHashSet<>();

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}