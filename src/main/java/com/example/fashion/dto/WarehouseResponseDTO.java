package com.example.fashion.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseResponseDTO {
    private Long id;
    private String name;
    private String location;
}