// src/main/java/com/example/fashion/repository/ProductRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // THÊM DÒNG NÀY
=======
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
<<<<<<< HEAD
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
=======
public interface ProductRepository extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> {

    @Query("SELECT p FROM Product p JOIN p.variants v WHERE v.id = :variantId")
    Optional<Product> findByVariantId(@Param("variantId") Long variantId);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.variants")
    Page<Product> findAllWithVariants(Pageable pageable);

    // ĐÃ FIX 100% – DÙNG @Query ĐỂ BỎ QUA VIỆC PARSE TÊN
    @EntityGraph(attributePaths = {"category", "brand", "variants", "images", "sizes"})
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithAllDetails(@Param("id") Long id);

    @EntityGraph(attributePaths = {"category", "brand", "variants", "images", "sizes"})
    @Query("SELECT p FROM Product p WHERE p.slug = :slug")
    Optional<Product> findBySlugWithAllDetails(@Param("slug") String slug);

    Optional<Product> findBySlug(String slug);
    boolean existsBySlug(String slug);
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
}