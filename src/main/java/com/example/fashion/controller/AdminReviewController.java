// src/main/java/com/example/fashion/controller/AdminReviewController.java
package com.example.fashion.controller;

import com.example.fashion.entity.Review;
import com.example.fashion.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewRepository reviewRepository;

    // 1. Lấy tất cả đánh giá
    @GetMapping
    public ResponseEntity<?> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();

        // SỬA LỖI: Thêm <String, Object> vào trước .of() để ép kiểu rõ ràng
        List<Map<String, Object>> response = reviews.stream().map(r -> Map.<String, Object>of(
                "id", r.getId(),
                "productName", r.getProduct() != null ? r.getProduct().getName() : "Sản phẩm đã xóa",
                "userName", r.getUser() != null ? r.getUser().getFullName() : "Ẩn danh",
                "rating", r.getRating(),
                "content", (r.getTitle() != null ? r.getTitle() + ": " : "") + r.getBody(),
                "reply", r.getReply() != null ? r.getReply() : ""
        )).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<?> replyReview(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return reviewRepository.findById(id).map(review -> {
            review.setReply(payload.get("reply"));
            reviewRepository.save(review);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}