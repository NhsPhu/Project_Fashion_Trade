// src/main/java/com/example/fashion/dto/ProductUpdateRequestDTO.java
package com.example.fashion.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter @Setter @AllArgsConstructor
@SuperBuilder(toBuilder = true) // DÙNG @SuperBuilder
public class ProductUpdateRequestDTO extends ProductCreateRequestDTO {
    // KHÔNG KHAI BÁO GÌ CẢ → DÙNG KẾ THỪA
}