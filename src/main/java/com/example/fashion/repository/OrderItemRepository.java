package com.example.fashion.repository;

import com.example.fashion.entity.OrderItem;
import com.example.fashion.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByVariant(ProductVariant variant);
}