// src/main/java/com/example/fashion/dto/InventoryResponseDTO.java
package com.example.fashion.dto;

import lombok.*;

public class InventoryResponseDTO {

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class LowStockItem {
        private Long inventoryId;
        private Long variantId;
        private String sku;
        private Integer currentStock;
        private String productName;
        private String attributes;
        private String warehouseName;
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class StockInfo {
        private Long inventoryId;
        private Long variantId;
        private String sku;
        private Integer quantity;
        private String productName;
        private String warehouseName;
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdateSuccess {
        @Builder.Default                  // ← THÊM DÒNG NÀY
        private boolean success = true;   // ← Bây giờ Lombok sẽ giữ lại giá trị default
        private String message;
    }
}