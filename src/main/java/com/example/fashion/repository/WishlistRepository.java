package com.example.fashion.repository;

import com.example.fashion.entity.Wishlist;
import com.example.fashion.entity.User;
import com.example.fashion.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
    Page<Wishlist> findByUser(User user, Pageable pageable);
    boolean existsByUserAndProduct(User user, Product product);
}