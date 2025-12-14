package com.example.fashion.dto;

import com.example.fashion.entity.OrderItem;
import com.example.fashion.entity.ProductImage;
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
public class OrderDTO {
    private Long id;
    private String orderNo;
    private LocalDateTime createdAt;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private AddressDTO shippingAddress;
    private List<OrderItemDTO> items;

    // Inner DTO for OrderItem
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDTO {
        private Long productId;
        private String productName;
        private String imageUrl;
        private Integer quantity;
        private BigDecimal price;

        public static OrderItemDTO fromEntity(OrderItem item) {
            OrderItemDTO dto = new OrderItemDTO();
            dto.setQuantity(item.getQuantity());
            dto.setPrice(item.getUnitPrice()); // Đã sửa ở lần trước

            if (item.getVariant() != null && item.getVariant().getProduct() != null) {
                var product = item.getVariant().getProduct();
                dto.setProductId(product.getId());
                dto.setProductName(product.getName()); // SỬA LỖI: getProductName() -> getName()

                // SỬA LỖI: Lấy ảnh mặc định thay vì truy cập Set bằng index
                dto.setImageUrl(product.getDefaultImage());
            }
            return dto;
        }
    }

    // Inner DTO for Address
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressDTO {
        private String fullAddress;
    }
}