package com.example.fashion.service;

import com.example.fashion.dto.ProductPublicResponseDTO;
import com.example.fashion.entity.Product;
import com.example.fashion.entity.User;
import com.example.fashion.entity.WishlistItem;
import com.example.fashion.repository.ProductRepository;
import com.example.fashion.repository.UserRepository;
import com.example.fashion.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistItemRepository wishlistItemRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<Long> getWishlistProductIds(Long userId) {
        return wishlistItemRepository.findByUserId(userId).stream()
                .map(item -> item.getProduct().getId())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductPublicResponseDTO> getWishlistProducts(Long userId) {
        return wishlistItemRepository.findByUserId(userId).stream()
                .map(WishlistItem::getProduct)
                .map(ProductPublicResponseDTO::fromProduct)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addToWishlist(Long userId, Long productId) {
        if (wishlistItemRepository.findByUserIdAndProductId(userId, productId).isPresent()) {
            throw new RuntimeException("Sản phẩm đã nằm trong danh sách yêu thích");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);

        wishlistItemRepository.save(item);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistItemRepository.findByUserIdAndProductId(userId, productId)
                .ifPresent(wishlistItemRepository::delete);
    }
}
