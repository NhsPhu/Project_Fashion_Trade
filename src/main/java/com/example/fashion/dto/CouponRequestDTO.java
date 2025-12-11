// src/main/java/com/example/fashion/dto/CouponRequestDTO.java
package com.example.fashion.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CouponRequestDTO {
    private String code;
    private String type;
    private BigDecimal value;
    private BigDecimal minOrderValue;
    private List<Long> productIds;
    private List<Long> categoryIds;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer usageLimit;
}