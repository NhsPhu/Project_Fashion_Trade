package com.example.fashion.repository;

import com.example.fashion.entity.ProductVariant;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    @EntityGraph(attributePaths = "product")
    List<ProductVariant> findByStockQuantityLessThanEqual(Integer threshold);
}