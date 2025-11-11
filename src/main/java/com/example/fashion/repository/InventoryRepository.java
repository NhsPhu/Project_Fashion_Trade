package com.example.fashion.repository;

import com.example.fashion.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductId(Long productId);
    List<Inventory> findByQuantityLessThanEqual(Integer threshold);
    List<Inventory> findByQuantityLessThanEqualAndProduct_Status(Integer threshold, String status);
}