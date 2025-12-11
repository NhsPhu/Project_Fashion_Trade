// src/main/java/com/example/fashion/repository/OrderItemRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // ĐÃ SỬA ĐÚNG 100% – DÙNG "variant" THAY VÌ "productVariant"
    @Query("""
        SELECT 
            oi.variant.id,
            SUM(oi.quantity) AS totalQuantity,
            SUM(oi.subtotal) AS totalRevenue
        FROM OrderItem oi
        JOIN oi.order o
        WHERE o.orderStatus = 'COMPLETED'
        GROUP BY oi.variant.id
        ORDER BY totalQuantity DESC
        """)
    List<Object[]> findTopSellingProducts(Pageable pageable);
}