package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mối quan hệ: Nhiều Biến thể thuộc 1 Sản phẩm
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sku", unique = true, length = 100)
    private String sku; // Mã định danh duy nhất cho biến thể


    // Chúng ta lưu dưới dạng String (JSON) và xử lý ở tầng service
    @Column(name = "attributes", columnDefinition = "TEXT")
    private String attributes;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price; // Giá gốc

    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice; // Giá khuyến mãi

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}