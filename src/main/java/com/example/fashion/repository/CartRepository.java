package com.example.fashion.repository;

import com.example.fashion.entity.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    @EntityGraph(attributePaths = {"items", "items.productVariant", "items.productVariant.product"})
    Optional<Cart> findByUserId(Long userId);
    
    @EntityGraph(attributePaths = {"items", "items.productVariant", "items.productVariant.product"})
    Optional<Cart> findBySessionId(String sessionId);
    
    @EntityGraph(attributePaths = {"items", "items.productVariant", "items.productVariant.product"})
    Optional<Cart> findById(Long id);
}
