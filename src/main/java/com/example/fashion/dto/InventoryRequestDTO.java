package com.example.fashion.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryRequestDTO {

    @NotNull(message = "variantId là bắt buộc")
    private Long variantId;

    @NotNull(message = "quantity là bắt buộc")
    @Min(value = 0, message = "quantity phải ≥ 0")
    private Integer quantity;
}