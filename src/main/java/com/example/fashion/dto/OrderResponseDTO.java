// src/main/java/com/example/fashion/dto/OrderResponseDTO.java
package com.example.fashion.dto;

import com.example.fashion.entity.Order;
import jakarta.persistence.EntityNotFoundException;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class OrderResponseDTO {

    private Long id;
    private String orderNo; // ← Dùng chung tên với frontend
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Thông tin User
    private Long userId;
    private String userEmail;

    // Thông tin đơn hàng
    private BigDecimal totalAmount;
    private BigDecimal finalAmount;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private String payStatus;
    private String orderStatus; // ← "Pending", "Confirmed",...
    private String paymentMethod;
    private String trackingNumber;

    // Địa chỉ giao hàng
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingProvince;

    private Set<OrderItemResponseDTO> items;

    /**
     * Chuyển đổi từ Entity Order → DTO
     */
    public static OrderResponseDTO fromOrder(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());

        // SỬA LỖI 1: Tên phương thức là getOrderNo()
        dto.setOrderNo(order.getOrderNo());

        dto.setCreatedAt(order.getCreatedAt());

        // SỬA LỖI 2: Xóa "npm" bị gõ thừa
        dto.setUpdatedAt(order.getUpdatedAt());

        // Xử lý User bị xóa (tránh lỗi LazyInitialization / EntityNotFound)
        try {
            if (order.getUser() != null) {
                dto.setUserId(order.getUser().getId());
                dto.setUserEmail(order.getUser().getEmail());
            }
        } catch (EntityNotFoundException e) {
            dto.setUserId(null);
            dto.setUserEmail("[Người dùng đã bị xóa]");
        }

        // Các trường còn lại
        dto.setTotalAmount(order.getTotalAmount());
        dto.setFinalAmount(order.getFinalAmount());
        dto.setShippingFee(order.getShippingFee());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setPayStatus(order.getPayStatus());

        // SỬA LỖI 3: Tên phương thức là getOrderStatus()
        dto.setOrderStatus(order.getOrderStatus());

        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTrackingNumber(order.getTrackingNumber());

        dto.setShippingName(order.getShippingName());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setShippingAddressLine(order.getShippingAddressLine());
        dto.setShippingCity(order.getShippingCity());
        dto.setShippingDistrict(order.getShippingDistrict());
        dto.setShippingProvince(order.getShippingProvince());

        // Chuyển đổi OrderItem
        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream()
                    .map(OrderItemResponseDTO::fromOrderItem)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}