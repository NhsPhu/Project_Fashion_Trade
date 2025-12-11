package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_variants")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductVariant {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sku", unique = true, length = 100)
    private String sku;

<<<<<<< HEAD

    // Chúng ta lưu dưới dạng String (JSON) và xử lý ở tầng service
=======
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    @Column(name = "attributes", columnDefinition = "TEXT")
    private String attributes;

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "sale_price", precision = 12, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "stock_quantity", nullable = false)
<<<<<<< HEAD
    private Integer stockQuantity;
=======
    @Builder.Default
    private Integer stockQuantity = 0;
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22

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