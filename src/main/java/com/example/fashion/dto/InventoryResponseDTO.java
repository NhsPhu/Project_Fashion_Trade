package com.example.fashion.dto;

import lombok.*;

public class InventoryResponseDTO {

    // Dùng cho GET /low-stock
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LowStockItem {
        private Long variantId;
        private String sku;
        private Integer currentStock;
        private String productName;
        private String attributes;
    }

    // Dùng cho GET /{variantId}
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class StockInfo {
        private Long variantId;
        private String sku;
        private Integer quantity;
        private String productName;
    }

    // Dùng cho POST / (thành công)
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateSuccess {
        private boolean success = true;
        private String message;
    }

    // Dùng cho lỗi
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ErrorResponse {
        private boolean success = false;
        private String message;
    }
}