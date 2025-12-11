// src/main/java/com/example/fashion/controller/ReviewController.java

package com.example.fashion.controller;

import com.example.fashion.dto.ReviewRequestDTO;
import com.example.fashion.dto.ReviewResponseDTO;
import com.example.fashion.entity.Product;
import com.example.fashion.entity.Review;
import com.example.fashion.entity.User;
import com.example.fashion.enums.ReviewStatus;
import com.example.fashion.repository.ProductRepository;
import com.example.fashion.repository.ReviewRepository;
import com.example.fashion.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user/reviews")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // DÒNG NÀY LÀ THẦN THÁNH!
public class ReviewController {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> create(
            @Valid @RequestBody ReviewRequestDTO dto,
            Authentication auth) {

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(dto.getRating())
                .title(dto.getTitle() != null ? dto.getTitle() : "Đánh giá từ khách hàng")
                .body(dto.getBody())
                .status(ReviewStatus.APPROVED)
                .build();

        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(ReviewResponseDTO.fromReview(saved));
    }
}