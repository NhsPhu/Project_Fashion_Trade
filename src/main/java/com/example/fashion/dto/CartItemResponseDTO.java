package com.example.fashion.dto;

import com.example.fashion.entity.CartItem;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CartItemResponseDTO {
    private Long id;
    private Long variantId;
    private String variantSku;
    private String productName;
    private String productImage;
    private Integer quantity;
    private BigDecimal priceAtAdd;
    private BigDecimal currentPrice;
    private BigDecimal subtotal;
    private Integer stockQuantity;

    public static CartItemResponseDTO fromCartItem(CartItem cartItem) {
        CartItemResponseDTO dto = new CartItemResponseDTO();
        dto.setId(cartItem.getId());
        
        if (cartItem.getProductVariant() != null) {
            dto.setVariantId(cartItem.getProductVariant().getId());
            dto.setVariantSku(cartItem.getProductVariant().getSku());
            dto.setStockQuantity(cartItem.getProductVariant().getStockQuantity());
            
            if (cartItem.getProductVariant().getProduct() != null) {
                dto.setProductName(cartItem.getProductVariant().getProduct().getName());
                dto.setProductImage(cartItem.getProductVariant().getProduct().getDefaultImage());
            }
            
            // Use sale price if available, otherwise use regular price
            BigDecimal currentPrice = cartItem.getProductVariant().getSalePrice() != null 
                    ? cartItem.getProductVariant().getSalePrice() 
                    : cartItem.getProductVariant().getPrice();
            dto.setCurrentPrice(currentPrice);
        }
        
        dto.setQuantity(cartItem.getQuantity());
        dto.setPriceAtAdd(cartItem.getPriceAtAdd());
        
        // Calculate subtotal
        if (dto.getCurrentPrice() != null && dto.getQuantity() != null) {
            dto.setSubtotal(dto.getCurrentPrice().multiply(BigDecimal.valueOf(dto.getQuantity())));
        }
        
        return dto;
    }
}
