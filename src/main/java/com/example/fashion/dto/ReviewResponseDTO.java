// src/main/java/com/example/fashion/dto/ReviewResponseDTO.java

package com.example.fashion.dto;

import com.example.fashion.entity.Review;
import com.example.fashion.enums.ReviewStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReviewResponseDTO {
    private Long id;
    private Long productId;
    private Long userId;
    private String userName;
    private Integer rating;
    private String title;
    private String body;
    private String status;                    // Vẫn là String để frontend dễ dùng
    private LocalDateTime createdAt;

    public static ReviewResponseDTO fromReview(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();

        dto.setId(review.getId());

        if (review.getProduct() != null) {
            dto.setProductId(review.getProduct().getId());
        }

        if (review.getUser() != null) {
            dto.setUserId(review.getUser().getId());
            dto.setUserName(review.getUser().getFullName());
        } else {
            dto.setUserName("Khách");
        }

        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setBody(review.getBody());

        // PHẢI DÙNG .name() – không có cách nào khác!
        // Vì entity dùng enum, DTO dùng String
        dto.setStatus(review.getStatus() != null
                ? review.getStatus().name()
                : "PENDING");

        dto.setCreatedAt(review.getCreatedAt());

        return dto;
    }
}