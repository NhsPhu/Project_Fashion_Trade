package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductFilterRequestDTO {
    private Long categoryId;
    private Long brandId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private List<String> colors;
    private List<String> sizes;
    private Boolean inStock;
    private Boolean onSale;
    private Integer minRating;
    private String search;
    private String sort;
}



