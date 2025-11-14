package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutRequestDTO {
    private Long addressId;
    private String paymentMethod;
    private String couponCode;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingProvince;
}




