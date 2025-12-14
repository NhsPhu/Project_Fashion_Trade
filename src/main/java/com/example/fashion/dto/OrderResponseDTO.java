package com.example.fashion.dto;

import com.example.fashion.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private String orderNo;
    private LocalDateTime createdAt;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private String customerName;
    private List<OrderDTO.OrderItemDTO> items;

    public static OrderResponseDTO fromOrder(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNo(order.getOrderNo());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getOrderStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setCustomerName(order.getCustomerName());
        dto.setItems(order.getItems().stream().map(OrderDTO.OrderItemDTO::fromEntity).collect(Collectors.toList()));
        return dto;
    }
}