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
    private LocalDateTime orderDate; // Đổi từ createdAt -> orderDate cho khớp

    private Long userId;
    private String userEmail;

    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private String payStatus;
    private String orderStatus;
    private String paymentMethod;

    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingCity;
    private String note;

    private Set<OrderItemResponseDTO> items;

    public static OrderResponseDTO fromOrder(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNo(order.getOrderNo());

        // Sửa: dùng getOrderDate() thay vì getCreatedAt()
        dto.setOrderDate(order.getOrderDate());

        try {
            if (order.getUser() != null) {
                dto.setUserId(order.getUser().getId());
                dto.setUserEmail(order.getUser().getEmail());
            }
        } catch (EntityNotFoundException e) {
            dto.setUserId(null);
            dto.setUserEmail("[Người dùng đã bị xóa]");
        }

        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingFee(order.getShippingFee());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setPayStatus(order.getPayStatus());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setPaymentMethod(order.getPaymentMethod());

        // Map các trường thông tin giao hàng
        dto.setShippingName(order.getShippingName());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setShippingCity(order.getShippingCity());
        dto.setNote(order.getNote());

        // Sửa: getItems() -> getOrderItems() (vì trong Order mình đặt là orderItems)
        if (order.getOrderItems() != null) {
            dto.setItems(order.getOrderItems().stream()
                    .map(OrderItemResponseDTO::fromOrderItem)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}