// src/main/java/com/example/fashion/repository/ProductRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p JOIN p.variants v WHERE v.id = :variantId")
    Optional<Product> findByVariantId(@Param("variantId") Long variantId);
}