// src/main/java/com/example/fashion/entity/Review.java

package com.example.fashion.entity;

import com.example.fashion.enums.ReviewStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@Builder
@NoArgsConstructor          // JPA yêu cầu
@AllArgsConstructor         // Tiện test
@ToString(exclude = {"product", "user"})
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
    @Column(name = "status", length = 50)
    private ReviewStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // FIX LỖI @Builder: giữ giá trị mặc định khi dùng builder()
    @Builder.Default
    @Column(name = "approved")
    private boolean approved = false;

    @Builder.Default
    @Column(name = "hidden")
    private boolean hidden = false;

    @Column(name = "admin_reply", columnDefinition = "TEXT")
    private String adminReply;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}