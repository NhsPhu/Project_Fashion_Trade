// src/main/java/com/example/fashion/dto/ReportResponseDTO.java
package com.example.fashion.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

public class ReportResponseDTO {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class RevenueReport {
        private String period;
        private Double totalRevenue;
        private Integer totalOrders;
        private List<DailyRevenue> breakdown;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DailyRevenue {
        private LocalDate date;
        private Double revenue;
        private Integer orders;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderReport {
        private Long total;
        private Long completed;
        private Long cancelled;
        private Long pending;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TopProduct {
        private Long productId;
        private String productName;
        private String sku;
        private Integer soldQuantity;
        private Double revenue;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LowStockItem {
        private Long variantId;
        private String sku;
        private Integer currentStock;
        private String productName;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CustomerReport {
        private Integer newCustomers;
        private Double conversionRate;
        private Long totalUsers;
        private Long totalOrders;
    }
}