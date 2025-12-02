package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatusRequestDTO {

    private String orderStatus;
    private String payStatus;
    private String trackingNumber;
}