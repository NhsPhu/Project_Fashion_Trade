package com.example.fashion.entity;

import com.example.fashion.enums.ReviewStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer rating; // 1-5
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    // --- THÊM DÒNG NÀY ĐỂ SỬA LỖI ---
    @Column(columnDefinition = "TEXT")
    private String reply; // Lưu câu trả lời của Admin
    // -------------------------------

    @Enumerated(EnumType.STRING)
    private ReviewStatus status;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = ReviewStatus.PENDING;
    }
}