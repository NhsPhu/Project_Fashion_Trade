package com.example.fashion.dto;

<<<<<<< HEAD
import lombok.Data;
import java.util.List;

// Sử dụng @Data của Lombok để tự động tạo getters/setters
// (như getUserId(), getItems(), v.v.)
@Data
public class CheckoutRequestDTO {

    // === CÁC TRƯỜNG BỊ THIẾU GÂY LỖI ===

    // Thêm trường này để sửa lỗi:
    // "Cannot resolve method 'getUserId' in 'CheckoutRequestDTO'"
    private Long userId;

    // Thêm trường này để sửa lỗi:
    // "Cannot resolve method 'getItems' in 'CheckoutRequestDTO'"
    private List<CartItem> items;

    // === LỚP BỊ THIẾU GÂY LỖI ===

    // Thêm lớp static 'CartItem' bên trong DTO để sửa lỗi:
    // "Cannot resolve symbol 'CartItem'"
    @Data
    public static class CartItem {

        // Thêm trường này để sửa lỗi:
        // "Cannot resolve method 'getVariantId'"
        private Long variantId;

        // Thêm trường này để sửa lỗi:
        // "Cannot resolve method 'getQuantity'" (ở nhiều dòng)
        private Integer quantity;
    }

    // === CÁC TRƯỜNG DƯỜNG NHƯ ĐÃ CÓ ===
    // (Vì OrderService sử dụng chúng mà không báo lỗi trong ảnh)
=======
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class CheckoutRequestDTO {
    private Long userId;
    private Long addressId;
    private String paymentMethod;
    private String couponCode;
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingProvince;
<<<<<<< HEAD
    private String paymentMethod;

    // Bạn cũng có thể cần thêm phí vận chuyển ở đây nếu nó từ client gửi lên
    // private BigDecimal shippingFee;
}   
=======

    private List<CartItem> items;

    @Getter @Setter
    public static class CartItem {
        private Long variantId;
        private Integer quantity;
    }
}
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
