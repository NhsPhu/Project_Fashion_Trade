package com.example.fashion.service;

import com.example.fashion.dto.CheckoutRequestDTO;
import com.example.fashion.dto.OrderDTO;
import com.example.fashion.dto.OrderResponseDTO;
import com.example.fashion.dto.UpdateOrderStatusRequestDTO;
import com.example.fashion.entity.*;
import com.example.fashion.repository.*;
import com.example.fashion.security.SecurityUtils; // 1. Import SecurityUtils
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils; // 2. Inject SecurityUtils

    @Transactional
    public Order createOrder(CheckoutRequestDTO request) {
        // 3. Lấy userId từ Token thay vì từ request
        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User not authenticated");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .orderNo(generateOrderNo())
                .user(user)
                .customerName(request.getShippingName())
                .shippingName(request.getShippingName())
                .shippingPhone(request.getShippingPhone())
                .shippingAddressLine(request.getShippingAddressLine())
                .paymentMethod(request.getPaymentMethod())
                .orderStatus("PENDING")
                .payStatus("PENDING")
                .totalAmount(BigDecimal.ZERO)
                .shippingFee(BigDecimal.ZERO)
                .finalAmount(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .items(new HashSet<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CheckoutRequestDTO.CartItem item : request.getItems()) {
            ProductVariant variant = variantRepository.findById(item.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));

            if (variant.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock");
            }

            BigDecimal unitPrice = variant.getSalePrice() != null
                    ? variant.getSalePrice()
                    : variant.getPrice();

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
        BigDecimal shippingFee = order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO;
        order.setFinalAmount(totalAmount.add(shippingFee));

        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponseDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(OrderResponseDTO::fromOrder);
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return OrderResponseDTO.fromOrder(order);
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderDetailsForUser(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return convertToDto(order);
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

    private OrderDTO convertToDto(Order order) {
        String fullAddress = Stream.of(
                        order.getShippingAddressLine(),
                        order.getShippingDistrict(),
                        order.getShippingCity(),
                        order.getShippingProvince()
                )
                .filter(Objects::nonNull)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.joining(", "));

        OrderDTO.AddressDTO addressDTO = new OrderDTO.AddressDTO(fullAddress);

        List<OrderDTO.OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(OrderDTO.OrderItemDTO::fromEntity)
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getOrderNo(),
                order.getCreatedAt(),
                order.getTotalAmount(),
                order.getOrderStatus(),
                order.getPaymentMethod(),
                addressDTO,
                itemDTOs
        );
    }
}