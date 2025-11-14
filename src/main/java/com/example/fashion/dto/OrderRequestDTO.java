// src/main/java/com/example/fashion/dto/OrderRequestDTO.java
package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
public class OrderRequestDTO {

    private Long userId;

    // Danh sách sản phẩm
    private Set<OrderItemRequestDTO> items;

    // Thông tin giao hàng
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingProvince;

    // Thanh toán
    private String paymentMethod;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
}