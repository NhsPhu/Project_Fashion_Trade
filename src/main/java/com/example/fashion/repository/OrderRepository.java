package com.example.fashion.repository;

import com.example.fashion.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Giữ nguyên, dùng để lấy danh sách đơn hàng
    List<Order> findByUserId(Long userId);
    
    // Thêm phương thức mới để lấy chi tiết đơn hàng của một user cụ thể
    Optional<Order> findByIdAndUserId(Long id, Long userId);

    Order findByOrderNo(String orderNo);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.payStatus = 'PAID' OR o.paymentMethod = 'COD'")
    Double findTotalRevenue();

    // === THÊM 2 HÀM NÀY ĐỂ SỬA LỖI REPORT SERVICE ===
    // Tìm đơn hàng trong khoảng thời gian (Dùng orderDate)
    List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);

    // Đếm số đơn hàng trong khoảng thời gian
    long countByOrderDateBetween(LocalDateTime start, LocalDateTime end);
}
