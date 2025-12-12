package com.example.fashion.repository;

import com.example.fashion.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Tạm thời không cần phương thức tùy chỉnh
}