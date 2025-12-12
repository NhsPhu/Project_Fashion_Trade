package com.example.fashion.repository;

import com.example.fashion.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository
        extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    /**
     * Tính tổng doanh thu từ các đơn hàng đã giao (Delivered)
     */
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.orderStatus = 'Delivered'")
    Double findTotalRevenue();

    // ========================================================================
    // CÁC HÀM MỚI THÊM ĐỂ SỬA LỖI REPORT SERVICE
    // ========================================================================

    // 1. Tìm đơn hàng theo khoảng thời gian tạo
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // 2. Đếm số lượng đơn hàng theo khoảng thời gian tạo
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}