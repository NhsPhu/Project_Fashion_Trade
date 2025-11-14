package com.example.fashion.dto;

import com.example.fashion.entity.OrderItem;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class OrderItemResponseDTO {
    private Long id;
    private Long variantId;
    private String productName;
    private String variantSku;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;

    /**
     * Chuyển đổi từ Entity sang DTO
     */
    public static OrderItemResponseDTO fromOrderItem(OrderItem item) {
        OrderItemResponseDTO dto = new OrderItemResponseDTO();
        dto.setId(item.getId());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setQuantity(item.getQuantity());
        dto.setSubtotal(item.getSubtotal());

        // Lấy thông tin từ ProductVariant (nếu tồn tại)
        // SỬA LỖI: item.getProductVariant() -> item.getVariant()
        if (item.getVariant() != null) {
            dto.setVariantId(item.getVariant().getId());
            // Lấy SKU từ variant
            dto.setVariantSku(item.getVariant().getSku());
            // Lấy tên sản phẩm từ Product cha của variant
            if (item.getVariant().getProduct() != null) {
                dto.setProductName(item.getVariant().getProduct().getName());
            }
        } else {

            dto.setProductName(item.getProductName());
        }

        return dto;
    }
}