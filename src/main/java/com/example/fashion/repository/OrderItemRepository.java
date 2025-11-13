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

    @Query("""
        SELECT 
            oi.productVariant.id,
            SUM(oi.quantity),
            SUM(oi.subtotal)
        FROM OrderItem oi
        JOIN oi.order o
        WHERE o.orderStatus = 'COMPLETED'
        GROUP BY oi.productVariant.id
        ORDER BY SUM(oi.quantity) DESC
        """)
    List<Object[]> findTopSellingProducts(Pageable pageable);
}