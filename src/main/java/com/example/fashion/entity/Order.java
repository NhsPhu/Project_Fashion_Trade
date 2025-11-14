package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "shipping_fee")
    private BigDecimal shippingFee;

    @Column(name = "discount_amount")
    private BigDecimal discountAmount;

    // ======================================
    // ===== TRƯỜNG BỊ THIẾU ĐÃ ĐƯỢC THÊM =====
    @Column(name = "final_amount", precision = 12, scale = 2)
    private BigDecimal finalAmount;
    // ======================================

    @Column(name = "pay_status")
    private String payStatus;

    @Column(name = "order_status")
    private String orderStatus;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "tracking_number")
    private String trackingNumber;

    // Thông tin shipping
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

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<OrderItem> items;
}