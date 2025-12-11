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

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductVariantRepository productVariantRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.userRepository = userRepository;
    }

    /**
     * LẤY GIỎ HÀNG – CHỈ ĐỌC (readOnly = true)
     */
    @Transactional(readOnly = true)
    public CartResponseDTO getCart(Long userId, String sessionId) {
        Cart cart = resolveCart(userId, sessionId, false); // ← KHÔNG TẠO MỚI
        if (cart == null) {
            return CartResponseDTO.empty();
        }
        // Force load items
        cart.getItems().size();
        return CartResponseDTO.fromCart(cart);
    }

    /**
     * ĐẢM BẢO GIỎ HÀNG TỒN TẠI (có thể tạo mới) – GHI DỮ LIỆU
     */
    @Transactional
    public Cart ensureCart(Long userId, String sessionId) {
        return resolveCart(userId, sessionId, true);
    }

    /**
     * Thêm sản phẩm vào giỏ hàng.
     */
    @Transactional
    public CartResponseDTO addItem(Long userId, String sessionId, CartItemRequestDTO request) {
        Cart cart = ensureCart(userId, sessionId); // ← Đảm bảo có cart
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể sản phẩm"));

        if (variant.getStockQuantity() != null && request.getQuantity() > variant.getStockQuantity()) {
            throw new RuntimeException("Số lượng vượt quá tồn kho");
        }

        CartItem cartItem = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), variant.getId())
                .orElseGet(() -> {
                    CartItem item = new CartItem();
                    item.setCart(cart);
                    item.setProductVariant(variant);
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

        return CartResponseDTO.fromCart(cartRepository.findById(cart.getId()).orElseThrow());
    }

    /**
     * Cập nhật số lượng.
     */
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
            ProductVariant variant = cartItem.getProductVariant();
            if (variant.getStockQuantity() != null && quantity > variant.getStockQuantity()) {
                throw new RuntimeException("Số lượng vượt quá tồn kho");
            }
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        return CartResponseDTO.fromCart(cartRepository.findById(cart.getId()).orElseThrow());
    }

    /**
     * Xóa một sản phẩm khỏi giỏ hàng.
     */
    @Transactional
    public CartResponseDTO removeItem(Long userId, String sessionId, Long itemId) {
        Cart cart = ensureCart(userId, sessionId);
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Sản phẩm không thuộc giỏ hàng");
        }

        cartItemRepository.delete(cartItem);
        return CartResponseDTO.fromCart(cartRepository.findById(cart.getId()).orElseThrow());
    }

    /**
     * Xóa toàn bộ giỏ hàng.
     */
    @Transactional
    public void clearCart(Long userId, String sessionId) {
        Cart cart = resolveCart(userId, sessionId, false);
        if (cart != null) {
            cartItemRepository.deleteByCartId(cart.getId());
            cartRepository.delete(cart);
        }
    }

    /**
     * Resolve cart: ưu tiên userId → sessionId → tạo mới nếu cần
     */
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