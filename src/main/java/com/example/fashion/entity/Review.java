// src/main/java/com/example/fashion/entity/Review.java
package com.example.fashion.entity;

import com.example.fashion.enums.ReviewStatus; // ĐÚNG CHỖ
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "body", columnDefinition = "TEXT")
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private ReviewStatus status = ReviewStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
<<<<<<< HEAD
=======

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    @Column(name = "approved")
    private boolean approved = false;

    @Column(name = "hidden")
    private boolean hidden = false;

    @Column(name = "admin_reply")
    private String adminReply;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
}