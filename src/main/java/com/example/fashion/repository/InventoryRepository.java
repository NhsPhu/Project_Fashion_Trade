package com.example.fashion.repository;

import com.example.fashion.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByVariantIdAndWarehouseId(Long variantId, Long warehouseId);

    List<Inventory> findByQuantityLessThanEqual(Integer threshold);

    List<Inventory> findByVariantId(Long variantId);
}