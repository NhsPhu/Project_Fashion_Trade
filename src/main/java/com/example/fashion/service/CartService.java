package com.example.fashion.service;

import com.example.fashion.dto.CartItemRequestDTO;
import com.example.fashion.dto.CartResponseDTO;
import com.example.fashion.entity.Cart;
import com.example.fashion.entity.CartItem;
import com.example.fashion.entity.Coupon;
import com.example.fashion.entity.ProductVariant;
import com.example.fashion.repository.CartItemRepository;
import com.example.fashion.repository.CartRepository;
import com.example.fashion.repository.CouponRepository;
import com.example.fashion.repository.ProductVariantRepository;
import com.example.fashion.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
@Service
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductVariantRepository productVariantRepository,
                       UserRepository userRepository,
                       CouponRepository couponRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.userRepository = userRepository;
        this.couponRepository = couponRepository;
    }
    /* LẤY GIỎ HÀNG – CHỈ ĐỌC (readOnly = true) */
    @Transactional(readOnly = true)
    public CartResponseDTO getCart(Long userId, String sessionId) {
        Cart cart = resolveCart(userId, sessionId, false);
        if (cart == null) {
            return CartResponseDTO.empty();
        }
// Force load items
        cart.getItems().size();
        return CartResponseDTO.fromCart(cart);
    }
    /* ĐẢM BẢO GIỎ HÀNG TỒN TẠI (có thể tạo mới) – GHI DỮ LIỆU */
    @Transactional
    public Cart ensureCart(Long userId, String sessionId) {
        return resolveCart(userId, sessionId, true);
    }
    /* Thêm sản phẩm vào giỏ hàng */
    @Transactional
    public CartResponseDTO addItem(Long userId, String sessionId, CartItemRequestDTO request) {
        Cart cart = ensureCart(userId, sessionId);
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
    /* Cập nhật số lượng */
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
    /* Xóa một sản phẩm khỏi giỏ hàng */
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
    /* Xóa toàn bộ giỏ hàng */
    @Transactional
    public void clearCart(Long userId, String sessionId) {
        Cart cart = resolveCart(userId, sessionId, false);
        if (cart != null) {
            cartItemRepository.deleteByCartId(cart.getId());
            cartRepository.delete(cart);
        }
    }
    /* Resolve cart: ưu tiên userId → sessionId → tạo mới nếu cần */
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
    /* Tính toán giảm giá dựa trên mã giảm giá */
    @Transactional(readOnly = true)
    public BigDecimal calculateDiscount(String couponCode, Long cartId) {
        if (couponCode == null || couponCode.trim().isEmpty()) {
            return BigDecimal.ZERO;
        }
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));
        if (cart.getItems().isEmpty()) {
            return BigDecimal.ZERO;
        }
        Coupon coupon = couponRepository.findByCodeIgnoreCase(couponCode.trim())
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));
        LocalDateTime now = LocalDateTime.now();
// Kiểm tra điều kiện hợp lệ của coupon
        if (!coupon.getActive()
                || (coupon.getStartDate() != null && coupon.getStartDate().isAfter(now))
                || (coupon.getEndDate() != null && coupon.getEndDate().isBefore(now))
                || coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException("Mã giảm giá không hợp lệ, đã hết hạn hoặc hết lượt sử dụng");
        }
// Tính tổng tiền giỏ hàng
        BigDecimal cartTotal = cart.getItems().stream()
                .map(item -> item.getPriceAtAdd().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
// Kiểm tra đơn tối thiểu
        if (coupon.getMinOrderValue() != null && cartTotal.compareTo(coupon.getMinOrderValue()) < 0) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã giảm giá");
        }
        BigDecimal discount = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            ProductVariant variant = item.getProductVariant();
            Long productId = variant.getProduct().getId();
// Lấy categoryId từ Product (giả sử Product có getCategory() và Category có getId())
            Long categoryId = variant.getProduct().getCategory() != null
                    ? variant.getProduct().getCategory().getId()
                    : null;
// Kiểm tra sản phẩm có phù hợp với điều kiện coupon không
            boolean matches = false;
// Ưu tiên productIds nếu có
            if (coupon.getProductIds() != null && !coupon.getProductIds().isEmpty()) {
                matches = coupon.getProductIds().contains(productId);
            }
// Nếu không có productIds thì kiểm tra categoryIds
            else if (coupon.getCategoryIds() != null && !coupon.getCategoryIds().isEmpty()) {
                matches = categoryId != null && coupon.getCategoryIds().contains(categoryId);
            }
// Nếu cả hai đều trống → áp dụng cho toàn bộ giỏ hàng
            else {
                matches = true;
            }
            if (matches) {
                BigDecimal itemTotal = item.getPriceAtAdd().multiply(BigDecimal.valueOf(item.getQuantity()));
                if ("PERCENT".equals(coupon.getType())) {
                    BigDecimal percentDiscount = itemTotal.multiply(coupon.getValue())
                            .divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);
                    discount = discount.add(percentDiscount);
                } else if ("FIXED".equals(coupon.getType())) {
                    discount = discount.add(coupon.getValue());
                }
// FREE_SHIPPING: xử lý riêng ở phần phí vận chuyển
            }
        }
        return discount;
    }
}