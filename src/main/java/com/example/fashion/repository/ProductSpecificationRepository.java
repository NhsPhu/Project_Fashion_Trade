package com.example.fashion.repository;

import com.example.fashion.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductSpecificationRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    @EntityGraph(attributePaths = {"category", "brand", "variants", "images"})
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithDetails(@Param("id") Long id);
}
