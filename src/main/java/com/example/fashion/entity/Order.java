package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder // THÊM @Builder
public class Order {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_no")
    private String orderNo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "shipping_fee", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "final_amount", precision = 15, scale = 2)
    private BigDecimal finalAmount;

    @Column(name = "pay_status")
    private String payStatus;

    @Column(name = "order_status")
    private String orderStatus;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "shipping_name")
    private String shippingName;

    @Column(name = "shipping_phone")
    private String shippingPhone;

    @Column(name = "shipping_address_line")
    private String shippingAddressLine;

    @Column(name = "shipping_city")
    private String shippingCity;

    @Column(name = "shipping_district")
    private String shippingDistrict;

    @Column(name = "shipping_province")
    private String shippingProvince;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<OrderItem> items;

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