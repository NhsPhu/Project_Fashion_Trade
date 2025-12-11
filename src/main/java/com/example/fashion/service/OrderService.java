package com.example.fashion.service;

import com.example.fashion.dto.CheckoutRequestDTO; // SỬA: DÙNG DTO ĐÚNG
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

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order createOrder(CheckoutRequestDTO request) { // SỬA: CheckoutRequestDTO
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .orderNo(generateOrderNo())
                .user(user)
                .customerName(request.getShippingName()) // DÙNG shippingName
                .shippingName(request.getShippingName())
                .shippingPhone(request.getShippingPhone())
                .shippingAddressLine(request.getShippingAddressLine())
                .shippingCity(request.getShippingCity())
                .shippingDistrict(request.getShippingDistrict())
                .shippingProvince(request.getShippingProvince())
                .paymentMethod(request.getPaymentMethod())
                .orderStatus("PENDING")
                .payStatus("PENDING")
                .totalAmount(BigDecimal.ZERO)
                .finalAmount(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .items(new HashSet<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CheckoutRequestDTO.CartItem item : request.getItems()) { // CartItem có trong DTO
            ProductVariant variant = variantRepository.findById(item.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));

            if (variant.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock");
            }

            BigDecimal unitPrice = variant.getSalePrice() != null
                    ? variant.getSalePrice()
                    : variant.getPrice(); // SỬA: getPrice() thay vì getOriginalPrice()

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .variant(variant)
                    .quantity(item.getQuantity())
                    .unitPrice(unitPrice)
                    .subtotal(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())))
                    .build();

            order.getItems().add(orderItem);
            totalAmount = totalAmount.add(orderItem.getSubtotal());

            variant.setStockQuantity(variant.getStockQuantity() - item.getQuantity());
            variantRepository.save(variant);
        }

        order.setTotalAmount(totalAmount);
        order.setFinalAmount(totalAmount.add(order.getShippingFee()));

        return orderRepository.save(order);
    }

    public Page<OrderResponseDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(OrderResponseDTO::fromOrder);
    }

    public OrderResponseDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return OrderResponseDTO.fromOrder(order);
    }

    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderId, UpdateOrderStatusRequestDTO request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (request.getOrderStatus() != null && !request.getOrderStatus().isEmpty()) {
            order.setOrderStatus(request.getOrderStatus());
        }
        if (request.getPayStatus() != null && !request.getPayStatus().isEmpty()) {
            order.setPayStatus(request.getPayStatus());
        }
        if (request.getTrackingNumber() != null && !request.getTrackingNumber().isEmpty()) {
            order.setTrackingNumber(request.getTrackingNumber());
        }

        order.setUpdatedAt(LocalDateTime.now());
        return OrderResponseDTO.fromOrder(orderRepository.save(order));
    }

    private String generateOrderNo() {
        return "ORD-" + System.currentTimeMillis();
    }
}