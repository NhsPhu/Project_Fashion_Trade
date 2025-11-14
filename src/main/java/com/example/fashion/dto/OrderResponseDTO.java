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
    private String orderNo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long userId;
    private String userEmail;

    private String customerName; // Từ customer_name (DB) → ưu tiên, nếu null thì dùng shipping_name

    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private String payStatus;
    private String orderStatus;
    private String paymentMethod;
    private String trackingNumber;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingProvince;
    private Set<OrderItemResponseDTO> items;

    public static OrderResponseDTO fromOrder(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNo(order.getOrderNo());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        try {
            if (order.getUser() != null) {
                dto.setUserId(order.getUser().getId());
                dto.setUserEmail(order.getUser().getEmail());
            }
        } catch (EntityNotFoundException e) {
            dto.setUserId(null);
            dto.setUserEmail("[Người dùng đã bị xóa]");
        }

        // SỬA: Ưu tiên customer_name → shipping_name → "Khách lẻ"
        String name = order.getCustomerName();
        if (name == null || name.trim().isEmpty()) {
            name = order.getShippingName();
        }
        dto.setCustomerName(name != null && !name.trim().isEmpty() ? name.trim() : "Khách lẻ");

        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingFee(order.getShippingFee());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setPayStatus(order.getPayStatus());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTrackingNumber(order.getTrackingNumber());

        dto.setShippingName(order.getShippingName());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setShippingAddressLine(order.getShippingAddressLine());
        dto.setShippingCity(order.getShippingCity());
        dto.setShippingDistrict(order.getShippingDistrict());
        dto.setShippingProvince(order.getShippingProvince());

        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream()
                    .map(OrderItemResponseDTO::fromOrderItem)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}