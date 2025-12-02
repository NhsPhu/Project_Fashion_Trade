package com.example.fashion.service;

import com.example.fashion.dto.CheckoutRequestDTO;
import com.example.fashion.dto.OrderResponseDTO;
import com.example.fashion.dto.UpdateOrderStatusRequestDTO;
import com.example.fashion.entity.*;
import com.example.fashion.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    private static final BigDecimal SHIPPING_FEE = BigDecimal.valueOf(30000);

    @Transactional
    public Order checkout(Long userId, CheckoutRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng trống"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng không có sản phẩm nào");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderNo(generateOrderNo());
        order.setOrderStatus("PENDING");
        order.setPayStatus("PENDING");
        order.setShippingName(request.getShippingName());
        order.setShippingPhone(request.getShippingPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setNote(request.getNote());
        order.setPaymentMethod(request.getPaymentMethod());

        BigDecimal totalAmount = BigDecimal.ZERO;
        Set<OrderItem> orderItems = new HashSet<>();

        for (CartItem cartItem : cart.getItems()) {
            ProductVariant variant = cartItem.getVariant();
            if (variant.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + variant.getProduct().getName() + " không đủ số lượng tồn kho!");
            }
            variant.setStockQuantity(variant.getStockQuantity() - cartItem.getQuantity());
            productVariantRepository.save(variant);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setVariant(variant);
            orderItem.setProductName(variant.getProduct().getName());
            orderItem.setQuantity(cartItem.getQuantity());

            BigDecimal currentPrice = (variant.getSalePrice() != null) ? variant.getSalePrice() : variant.getPrice();
            orderItem.setUnitPrice(currentPrice);

            BigDecimal subtotal = currentPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            orderItem.setSubtotal(subtotal);

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(subtotal);
        }

        order.setShippingFee(SHIPPING_FEE);
        order.setTotalAmount(totalAmount.add(SHIPPING_FEE));
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        cartRepository.delete(cart);

        return savedOrder;
    }

    // =========================================================
    // PHẦN DÀNH CHO USER
    // =========================================================

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderDetails(Long orderId, Long userId) {
        return orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập."));
    }


    // =========================================================
    // PHẦN DÀNH CHO ADMIN
    // =========================================================

    public Page<OrderResponseDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(OrderResponseDTO::fromOrder);
    }

    public OrderResponseDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + id));
        return OrderResponseDTO.fromOrder(order);
    }

    @Transactional
    public OrderResponseDTO updateOrderStatus(Long id, UpdateOrderStatusRequestDTO request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + id));

        if (request.getOrderStatus() != null && !request.getOrderStatus().isEmpty()) {
            order.setOrderStatus(request.getOrderStatus());
        }

        if (request.getPayStatus() != null && !request.getPayStatus().isEmpty()) {
            order.setPayStatus(request.getPayStatus());
        }

        Order updatedOrder = orderRepository.save(order);
        return OrderResponseDTO.fromOrder(updatedOrder);
    }

    @Transactional
    public void updatePaymentStatus(Long orderId, String paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
        order.setPayStatus(paymentStatus);
        if ("PAID".equals(paymentStatus)) {
            order.setOrderStatus("PROCESSING");
        }
        orderRepository.save(order);
    }

    private String generateOrderNo() {
        return "ORD-" + System.currentTimeMillis();
    }
}
