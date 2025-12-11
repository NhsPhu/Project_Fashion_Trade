// src/main/java/com/example/fashion/dto/ReviewResponseDTO.java
package com.example.fashion.dto;

import com.example.fashion.entity.Review;
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
<<<<<<< HEAD
    private String status; // ← String
=======
    private String status;          // ← Đây là String, không phải Enum
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
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
<<<<<<< HEAD
=======
        } else {
            dto.setUserName("Khách");
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
        }

        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setBody(review.getBody());

<<<<<<< HEAD
        // ĐÃ SỬA: enum → String
        dto.setStatus(review.getStatus().name()); // ← .name() convert enum → String

        dto.setCreatedAt(review.getCreatedAt());

=======
        // ĐÃ SỬA DỨT ĐIỂM: status là String → KHÔNG DÙNG .name() NỮA!
        dto.setStatus(review.getStatus());   // ← Chỉ cần thế này là xong!

        dto.setCreatedAt(review.getCreatedAt());
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
        return dto;
    }
}