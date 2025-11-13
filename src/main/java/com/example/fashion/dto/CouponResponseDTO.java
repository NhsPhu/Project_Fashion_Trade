// src/main/java/com/example/fashion/dto/CouponResponseDTO.java
package com.example.fashion.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CouponResponseDTO {
    private Long id;
    private String code;
    private String type;
    private BigDecimal value;
    private BigDecimal minOrderValue;
    private List<Long> productIds;
    private List<Long> categoryIds;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer usageLimit;
    private Integer usedCount;
    private Boolean active;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Success {
        private String message;
    }
}