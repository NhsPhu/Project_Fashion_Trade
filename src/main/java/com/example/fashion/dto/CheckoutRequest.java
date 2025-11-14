package com.example.fashion.dto;

import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequest {

    // Thông tin người nhận, khớp với file Order.java của bạn
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingProvince;
    private String paymentMethod; // Ví dụ: "COD", "VNPAY"

    // Danh sách sản phẩm trong giỏ hàng
    private List<CartItemDTO> items;
}