// src/main/java/com/example/fashion/repository/OrderRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // SỬA: finalAmount → totalAmount
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderStatus = 'COMPLETED'")
    Double findTotalRevenue();

    // Các query khác (nếu có) cũng kiểm tra lại tên field
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Ví dụ: Nếu có query khác dùng finalAmount → SỬA HẾT!
    // @Query("SELECT o FROM Order o WHERE o.finalAmount > :amount") → SỬA THÀNH totalAmount
}