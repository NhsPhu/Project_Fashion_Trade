package com.example.fashion.service;

import com.example.fashion.dto.CartItemRequestDTO;
import com.example.fashion.dto.CartResponseDTO;
import com.example.fashion.entity.Cart;
import com.example.fashion.entity.CartItem;
import com.example.fashion.entity.ProductVariant;
import com.example.fashion.repository.CartItemRepository;
import com.example.fashion.repository.CartRepository;
import com.example.fashion.repository.ProductVariantRepository;
import com.example.fashion.repository.UserRepository;
import jakarta.persistence.EntityManager; // ✅ THÊM IMPORT NÀY
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final EntityManager entityManager; // ✅ KHAI BÁO ENTITY MANAGER

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductVariantRepository productVariantRepository,
                       UserRepository userRepository,
                       EntityManager entityManager) { // ✅ INJECT VÀO CONSTRUCTOR
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.userRepository = userRepository;
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public CartResponseDTO getCart(Long userId, String sessionId) {
        Cart cart = resolveCart(userId, sessionId, false);
        if (cart == null) {
            return CartResponseDTO.empty();
        }
        cart.getItems().size(); // Force load
        return CartResponseDTO.fromCart(cart);
    }

    @Transactional
    public Cart ensureCart(Long userId, String sessionId) {
        return resolveCart(userId, sessionId, true);
    }

    @Transactional
    public CartResponseDTO addItem(Long userId, String sessionId, CartItemRequestDTO request) {
        Cart cart = ensureCart(userId, sessionId);
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể sản phẩm"));

        if (variant.getStockQuantity() != null && request.getQuantity() > variant.getStockQuantity()) {
            throw new RuntimeException("Số lượng vượt quá tồn kho");
        }

        CartItem cartItem = cartItemRepository.findByCartIdAndVariantId(cart.getId(), variant.getId())
                .orElseGet(() -> {
                    CartItem item = new CartItem();
                    item.setCart(cart);
                    item.setVariant(variant);
                    item.setQuantity(0);
                    item.setPriceAtAdd(variant.getSalePrice() != null && variant.getSalePrice().compareTo(BigDecimal.ZERO) > 0
                            ? variant.getSalePrice()
                            : variant.getPrice());
                    return item;
                });

        int newQuantity = cartItem.getQuantity() + request.getQuantity();
        if (variant.getStockQuantity() != null && newQuantity > variant.getStockQuantity()) {
            throw new RuntimeException("Số lượng vượt quá tồn kho");
        }

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);

        // ✅ QUAN TRỌNG: Ép Hibernate lưu xuống DB và tải lại Cart mới nhất
        entityManager.flush();
        entityManager.refresh(cart);

        return CartResponseDTO.fromCart(cart);
    }

    @Transactional
    public CartResponseDTO updateItem(Long userId, String sessionId, Long itemId, Integer quantity) {
        Cart cart = ensureCart(userId, sessionId);
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Sản phẩm không thuộc giỏ hàng");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            ProductVariant variant = cartItem.getVariant();
            if (variant.getStockQuantity() != null && quantity > variant.getStockQuantity()) {
                throw new RuntimeException("Số lượng vượt quá tồn kho");
            }
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        // ✅ Refresh để đảm bảo tổng tiền/số lượng cập nhật đúng
        entityManager.flush();
        entityManager.refresh(cart);

        return CartResponseDTO.fromCart(cart);
    }

    @Transactional
    public CartResponseDTO removeItem(Long userId, String sessionId, Long itemId) {
        Cart cart = ensureCart(userId, sessionId);
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Sản phẩm không thuộc giỏ hàng");
        }

        cartItemRepository.delete(cartItem);

        // ✅ Refresh để list items trong cart biến mất item vừa xóa
        entityManager.flush();
        entityManager.refresh(cart);

        return CartResponseDTO.fromCart(cart);
    }

    @Transactional
    public void clearCart(Long userId, String sessionId) {
        Cart cart = resolveCart(userId, sessionId, false);
        if (cart != null) {
            cartItemRepository.deleteByCartId(cart.getId());
            cartRepository.delete(cart);
        }
    }

    private Cart resolveCart(Long userId, String sessionId, boolean createIfMissing) {
        Cart cart = null;

        if (userId != null) {
            cart = cartRepository.findByUserId(userId).orElse(null);
        }

        if (cart == null && sessionId != null) {
            cart = cartRepository.findBySessionId(sessionId).orElse(null);
        }

        if (cart == null && createIfMissing) {
            cart = new Cart();
            cart.setSessionId(sessionId != null ? sessionId : UUID.randomUUID().toString());
            if (userId != null) {
                userRepository.findById(userId).ifPresent(cart::setUser);
            }
            cart = cartRepository.save(cart);
        } else if (cart != null && userId != null && cart.getUser() == null) {
            final Cart finalCart = cart;
            userRepository.findById(userId).ifPresent(user -> {
                finalCart.setUser(user);
                cartRepository.save(finalCart);
            });
        }

        return cart;
    }
}