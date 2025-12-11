// src/main/java/com/example/fashion/dto/UpdateOrderStatusRequestDTO.java
package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatusRequestDTO {

    private String orderStatus;     // "Pending", "Shipped", "Delivered",...
    private String payStatus;       // "Unpaid", "Paid", "Refunded"
    private String trackingNumber;  // Mã vận đơn
}