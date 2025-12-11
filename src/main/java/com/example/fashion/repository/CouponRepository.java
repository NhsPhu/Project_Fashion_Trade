// src/main/java/com/example/fashion/repository/CouponRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeIgnoreCase(String code);
    List<Coupon> findByActiveTrue();
}