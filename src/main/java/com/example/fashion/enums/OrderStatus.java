// src/main/java/com/example/fashion/enums/OrderStatus.java
package com.example.fashion.enums;

/**
 * Trạng thái đơn hàng
 */
public enum OrderStatus {
    PENDING,      // Chờ xác nhận
    CONFIRMED,    // Đã xác nhận
    PROCESSING,   // Đang xử lý
    SHIPPED,      // Đang giao
    DELIVERED,    // Đã giao
    CANCELLED,    // Đã hủy
    REFUNDED      // Đã hoàn tiền
}