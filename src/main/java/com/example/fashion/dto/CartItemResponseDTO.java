package com.example.fashion.dto;

import com.example.fashion.entity.CartItem;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemResponseDTO {
    private Long id;
    private Long variantId;
    private String productName;
    private String productSlug;
    private String sku;
    private String attributes;
    private String productImage;
    private Integer quantity;
    private BigDecimal priceAtAdd;
    private BigDecimal currentPrice;
    private BigDecimal subtotal;

    public static CartItemResponseDTO fromCartItem(CartItem cartItem) {
        CartItemResponseDTO dto = new CartItemResponseDTO();
        dto.setId(cartItem.getId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setPriceAtAdd(cartItem.getPriceAtAdd());

        // Kiểm tra an toàn: Nếu có biến thể
        if (cartItem.getVariant() != null) {
            dto.setVariantId(cartItem.getVariant().getId());
            dto.setSku(cartItem.getVariant().getSku());
            dto.setAttributes(cartItem.getVariant().getAttributes());

            // Lấy giá hiện tại (Ưu tiên giá Sale)
            BigDecimal price = cartItem.getVariant().getSalePrice() != null
                    ? cartItem.getVariant().getSalePrice()
                    : cartItem.getVariant().getPrice();
            dto.setCurrentPrice(price);

            if (cartItem.getVariant().getProduct() != null) {
                dto.setProductName(cartItem.getVariant().getProduct().getName());
                dto.setProductSlug(cartItem.getVariant().getProduct().getSlug());
                dto.setProductImage(cartItem.getVariant().getProduct().getDefaultImage());
            } else {
                dto.setProductName("Sản phẩm không tồn tại");
                dto.setProductImage("");
            }
        }

        // Tính tổng tiền an toàn
        BigDecimal price = dto.getCurrentPrice() != null ? dto.getCurrentPrice() : BigDecimal.ZERO;
        Integer qty = dto.getQuantity() != null ? dto.getQuantity() : 0;
        dto.setSubtotal(price.multiply(BigDecimal.valueOf(qty)));

        return dto;
    }
}