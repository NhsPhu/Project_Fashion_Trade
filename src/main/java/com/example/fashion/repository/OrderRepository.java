// src/main/java/com/example/fashion/repository/OrderRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
=======
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
<<<<<<< HEAD
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
=======
public interface OrderRepository extends JpaRepository<Order, Long> {

    // SỬA: finalAmount → totalAmount
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderStatus = 'COMPLETED'")
    Double findTotalRevenue();

    // Các query khác (nếu có) cũng kiểm tra lại tên field
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Ví dụ: Nếu có query khác dùng finalAmount → SỬA HẾT!
    // @Query("SELECT o FROM Order o WHERE o.finalAmount > :amount") → SỬA THÀNH totalAmount
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
}