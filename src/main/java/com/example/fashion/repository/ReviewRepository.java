// src/main/java/com/example/fashion/repository/ReviewRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.Review;
import com.example.fashion.enums.ReviewStatus; // ĐÚNG CHỖ
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.status = 'APPROVED'")
    Set<Review> findByProductId(@Param("productId") Long productId);

    Set<Review> findByUserId(Long userId);

    Set<Review> findByProductIdAndStatus(Long productId, ReviewStatus status);
}