package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class CheckoutRequestDTO {
    private Long userId;
    private Long addressId;
    private String paymentMethod;
    private String couponCode;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingProvince;

    private List<CartItem> items;

    @Getter @Setter
    public static class CartItem {
        private Long variantId;
        private Integer quantity;
    }
}