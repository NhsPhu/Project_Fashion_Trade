//package com.example.fashion.dto;
//
//import lombok.Getter;
//import lombok.Setter;
//import java.util.List;
//
//@Getter @Setter
//public class CheckoutRequestDTO {
//    private Long userId;
//    private Long addressId;
//    private String paymentMethod;
//    private String couponCode;
//    private String shippingName;
//    private String shippingPhone;
//    private String shippingAddressLine;
//    private String shippingCity;
//    private String shippingDistrict;
//    private String shippingProvince;
//
//    private List<CartItem> items;
//
//    @Getter @Setter
//    public static class CartItem {
//        private Long variantId;
//        private Integer quantity;
//    }
//}
package com.example.fashion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CheckoutRequestDTO {

    @NotBlank(message = "Tên người nhận không được để trống")
    private String shippingName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "(84|0[3|5|7|8|9])+([0-9]{8})\\b", message = "Số điện thoại không hợp lệ")
    private String shippingPhone;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    private String shippingAddress;

    // Tỉnh/Thành phố (Để tính phí ship nếu cần sau này)
    private String shippingCity;

    // Ghi chú đơn hàng (Tùy chọn)
    private String note;

    // Phương thức thanh toán: "COD" hoặc "VNPAY"
    @NotBlank(message = "Vui lòng chọn phương thức thanh toán")
    private String paymentMethod;
}