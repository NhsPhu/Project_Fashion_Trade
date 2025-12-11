// src/main/java/com/example/fashion/entity/Coupon.java
package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.*;
<<<<<<< HEAD

=======
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
<<<<<<< HEAD
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // Sửa lỗi .builder()
=======
@Table(name = "coupon")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

<<<<<<< HEAD
    @Column(unique = true, nullable = false)
    private String code;

    private String type;

    private BigDecimal value;

    // Sửa tên biến: minOrderAmount -> minOrderValue
    @Column(name = "min_order_value")
    private BigDecimal minOrderValue;

    // Thêm các trường List ID
    @ElementCollection
    @CollectionTable(name = "coupon_product_ids", joinColumns = @JoinColumn(name = "coupon_id"))
=======
    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(name = "value", precision = 10, scale = 2)
    private BigDecimal value;

    @Column(name = "min_order_value", precision = 10, scale = 2)
    private BigDecimal minOrderValue;

    @ElementCollection
    @CollectionTable(name = "coupon_product", joinColumns = @JoinColumn(name = "coupon_id"))
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    @Column(name = "product_id")
    private List<Long> productIds;

    @ElementCollection
<<<<<<< HEAD
    @CollectionTable(name = "coupon_category_ids", joinColumns = @JoinColumn(name = "coupon_id"))
    @Column(name = "category_id")
    private List<Long> categoryIds;

    // Sửa tên biến: startsAt -> startDate
    @Column(name = "start_date")
    private LocalDateTime startDate;

    // Sửa tên biến: endsAt -> endDate
    @Column(name = "end_date")
    private LocalDateTime endDate;

=======
    @CollectionTable(name = "coupon_category", joinColumns = @JoinColumn(name = "coupon_id"))
    @Column(name = "category_id")
    private List<Long> categoryIds;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "usage_limit")
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    private Integer usageLimit;
    private Integer usedCount;
    private Boolean active;

<<<<<<< HEAD
    @PrePersist
    public void prePersist() {
        if (usedCount == null) usedCount = 0;
        if (active == null) active = true;
    }
=======
    @Column(name = "used_count")
    @Builder.Default
    private Integer usedCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
}