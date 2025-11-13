// src/main/java/com/example/fashion/entity/Coupon.java
package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal; // THÊM import
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "coupon")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 20)
    private String type; // PERCENT, FIXED, FREE_SHIPPING

    // ĐÃ SỬA: Double → BigDecimal + scale
    @Column(name = "value", precision = 10, scale = 2)
    private BigDecimal value;

    @Column(name = "min_order_value", precision = 10, scale = 2)
    private BigDecimal minOrderValue;

    @ElementCollection
    @CollectionTable(name = "coupon_product", joinColumns = @JoinColumn(name = "coupon_id"))
    @Column(name = "product_id")
    private List<Long> productIds;

    @ElementCollection
    @CollectionTable(name = "coupon_category", joinColumns = @JoinColumn(name = "coupon_id"))
    @Column(name = "category_id")
    private List<Long> categoryIds;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "used_count")
    private Integer usedCount = 0;

    @Column(nullable = false)
    private Boolean active = true;
}