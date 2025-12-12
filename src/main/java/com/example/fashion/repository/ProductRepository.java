// src/main/java/com/example/fashion/repository/ProductRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // THÊM DÒNG NÀY
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> { // THÊM

    @EntityGraph(attributePaths = {"variants", "images", "category", "brand"})
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithDetails(@Param("id") Long id);

    @EntityGraph(attributePaths = {"variants", "images", "category", "brand"})
    @Query("SELECT p FROM Product p WHERE p.slug = :slug")
    Optional<Product> findBySlugWithDetails(@Param("slug") String slug);
    @Query(value = "SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.variants",
            countQuery = "SELECT COUNT(DISTINCT p) FROM Product p")
    Page<Product> findAllWithVariants(Pageable pageable);
}