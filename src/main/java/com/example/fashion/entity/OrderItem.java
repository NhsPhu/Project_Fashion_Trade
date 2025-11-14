package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal; // <-- THÊM DÒNG NÀY

@Entity
@Table(name = "order_items") // Tên bảng trong file SQL
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mối quan hệ: NHIỀU OrderItem thuộc về MỘT Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Mối quan hệ: MỘT OrderItem tương ứng với MỘT ProductVariant
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant; // Giả sử bạn có Entity ProductVariant

    @Column(name = "product_name")
    private String productName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice; // <-- SỬA LẠI THÀNH BigDecimal

    @Column(name = "subtotal", nullable = false)
    private BigDecimal subtotal; // <-- SỬA LẠI THÀNH BigDecimal
}