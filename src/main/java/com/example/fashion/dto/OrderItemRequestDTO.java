// src/main/java/com/example/fashion/dto/OrderItemRequestDTO.java
package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequestDTO {

    private Long variantId;
    private Integer quantity;
}