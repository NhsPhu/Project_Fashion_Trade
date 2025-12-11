package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // Sửa lỗi .builder()
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
    @Column(name = "product_id")
    private List<Long> productIds;

    @ElementCollection
    @CollectionTable(name = "coupon_category_ids", joinColumns = @JoinColumn(name = "coupon_id"))
    @Column(name = "category_id")
    private List<Long> categoryIds;

    // Sửa tên biến: startsAt -> startDate
    @Column(name = "start_date")
    private LocalDateTime startDate;

    // Sửa tên biến: endsAt -> endDate
    @Column(name = "end_date")
    private LocalDateTime endDate;

    private Integer usageLimit;
    private Integer usedCount;
    private Boolean active;

    @PrePersist
    public void prePersist() {
        if (usedCount == null) usedCount = 0;
        if (active == null) active = true;
    }
}