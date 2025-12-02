package com.example.fashion.repository;

import com.example.fashion.entity.CartItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Tìm item theo giỏ và biến thể
    Optional<CartItem> findByCartIdAndVariantId(Long cartId, Long variantId);

    // Lấy danh sách item
    @EntityGraph(attributePaths = {"variant", "variant.product", "variant.images"})
    List<CartItem> findByCartId(Long cartId);

    // Xóa item
    @Modifying
    void deleteByCartId(Long cartId);
}