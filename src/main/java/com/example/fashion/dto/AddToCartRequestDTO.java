package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class AddToCartRequestDTO {
    @NotNull(message = "Variant ID không được để trống")
    private Long variantId;
    
    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
}

