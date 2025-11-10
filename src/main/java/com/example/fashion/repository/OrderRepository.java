package com.example.fashion.repository;

import com.example.fashion.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query; // 1. Import Query
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    Optional<Order> findByOrderNo(String orderNo);

    // 2. THÊM HÀM MỚI (Tính tổng doanh thu)
    // (COALESCE để trả về 0.0 nếu không có đơn hàng nào)
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.orderStatus = 'Delivered'")
    Double findTotalRevenue();
}