// src/main/java/com/example/fashion/repository/OrderRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // 1. TÌM ĐƠN THEO NGÀY + TRẠNG THÁI (dùng tên field đúng: orderStatus)
    List<Order> findByCreatedAtBetweenAndOrderStatus(
            LocalDateTime start, LocalDateTime end, String orderStatus);

    // 2. TÌM ĐƠN THEO NGÀY
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // 3. ĐẾM ĐƠN THEO NGÀY
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // 4. TỔNG DOANH THU (dùng trạng thái bạn muốn: COMPLETED)
    @Query("SELECT COALESCE(SUM(o.finalAmount), 0) FROM Order o WHERE o.orderStatus = 'COMPLETED'")
    Double findTotalRevenue();
}