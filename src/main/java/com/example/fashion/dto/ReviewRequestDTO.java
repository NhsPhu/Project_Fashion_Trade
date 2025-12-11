package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequestDTO {
    private Long productId;
    private Integer rating;
    private String title;
    private String body;
}




