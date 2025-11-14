package com.example.fashion.service;

import com.example.fashion.dto.CheckoutRequest;
import com.example.fashion.dto.OrderResponseDTO;
import com.example.fashion.dto.UpdateOrderStatusRequestDTO;
import com.example.fashion.entity.Order;
import com.example.fashion.entity.OrderItem;
import com.example.fashion.entity.ProductVariant;
import com.example.fashion.entity.User;
import com.example.fashion.repository.OrderRepository;
import com.example.fashion.repository.ProductVariantRepository;
import com.example.fashion.repository.UserRepository;
import lombok.RequiredArgsConstructor; // Sử dụng @RequiredArgsConstructor
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;

@Service
@RequiredArgsConstructor // Tự động tiêm (inject) các biến final (thay cho constructor bạn viết)
public class OrderService {

    // Các repository cần thiết
    private final OrderRepository orderRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository; // Giả sử bạn có repo này

    // ==========================================================
    // CHỨC NĂNG 1: THANH TOÁN (CHECKOUT) - (Được gọi bởi OrderController)
    // ==========================================================

    /**
     * Xử lý logic tạo đơn hàng từ giỏ hàng.
     * Sử dụng @Transactional để đảm bảo tính toàn vẹn dữ liệu:
     * Nếu một thao tác (ví dụ: trừ kho) thất bại, tất cả các thao tác khác (lưu đơn hàng) sẽ bị hủy bỏ (rollback).
     */
    @Transactional
    public Order createOrder(CheckoutRequest request) {

        // (Tùy chọn) Lấy user đã đăng nhập nếu cần
        // String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        // User user = userRepository.findByEmail(userEmail)
        //         .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Tạo Order và set thông tin giao hàng từ DTO (khớp với file Order.java của bạn)
        Order order = new Order();
        // order.setUser(user);
        order.setCustomerName(request.getShippingName()); // Lấy tên khách hàng từ shipping
        order.setShippingName(request.getShippingName());
        order.setShippingPhone(request.getShippingPhone());
        order.setShippingAddressLine(request.getShippingAddressLine());
        order.setShippingCity(request.getShippingCity());
        order.setShippingDistrict(request.getShippingDistrict());
        order.setShippingProvince(request.getShippingProvince());

        // Set các trạng thái mặc định
        order.setPaymentMethod(request.getPaymentMethod());
        order.setOrderStatus("Pending"); // Trạng thái chờ
        order.setPayStatus("Pending");   // Trạng thái chờ
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setItems(new HashSet<>()); // Khởi tạo Set items (vì Order.java dùng Set)

        // Dùng BigDecimal để tính toán
        BigDecimal totalAmount = BigDecimal.ZERO;

        // 2. Lặp qua danh sách item trong giỏ hàng
        for (var itemDTO : request.getItems()) {
            // Lấy thông tin biến thể (variant) từ database
            ProductVariant variant = variantRepository.findById(itemDTO.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Product variant not found: " + itemDTO.getVariantId()));

            // Kiểm tra tồn kho
            if (variant.getStockQuantity() < itemDTO.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + variant.getProduct().getName());
            }

            // 3. Tạo OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order); // Set mối quan hệ 2 chiều
            orderItem.setVariant(variant);
            orderItem.setProductName(variant.getProduct().getName());
            orderItem.setQuantity(itemDTO.getQuantity());

            // Tính toán bằng BigDecimal
            // Giả định ProductVariant cũng dùng BigDecimal cho price
            BigDecimal price = (variant.getSalePrice() != null && variant.getSalePrice().compareTo(BigDecimal.ZERO) > 0)
                    ? variant.getSalePrice()
                    : variant.getPrice();

            orderItem.setUnitPrice(price);

            BigDecimal subtotal = price.multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            orderItem.setSubtotal(subtotal);

            // 4. Cộng vào tổng tiền
            totalAmount = totalAmount.add(subtotal);

            // 5. Thêm item vào đơn hàng (Set)
            order.getItems().add(orderItem);

            // 6. TRỪ KHO
            variant.setStockQuantity(variant.getStockQuantity() - itemDTO.getQuantity());
            variantRepository.save(variant); // Cập nhật lại tồn kho
        }

        // 7. Set tổng tiền và lưu đơn hàng
        order.setTotalAmount(totalAmount);
        order.setFinalAmount(totalAmount); // (Chưa xử lý shipping fee, discount)

        // (Tùy chọn) Bạn có thể thêm logic tính phí ship và discount ở đây
        // order.setShippingFee(new BigDecimal("30000"));
        // order.setFinalAmount(totalAmount.add(order.getShippingFee()));

        // Do `CascadeType.ALL` trong Order.java, khi lưu Order, các OrderItem con cũng tự động được lưu
        return orderRepository.save(order);
    }

    // ==========================================================
    // CHỨC NĂNG 2: QUẢN LÝ ĐƠN HÀNG (ADMIN) - (Code của bạn)
    // ==========================================================

    /**
     * Lấy danh sách đơn hàng (có phân trang) cho Admin
     */
    public Page<OrderResponseDTO> getAllOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findAll(pageable);

        // Chuyển đổi Page<Order> sang Page<OrderResponseDTO>
        // Dùng hàm static 'fromOrder' mà chúng ta đã viết trong DTO
        return orderPage.map(OrderResponseDTO::fromOrder);
    }

    /**
     * Lấy chi tiết một đơn hàng
     */
    public OrderResponseDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));

        // Chuyển đổi sang DTO để trả về
        return OrderResponseDTO.fromOrder(order);
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderId, UpdateOrderStatusRequestDTO request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));

        // Cập nhật các trường nếu chúng được cung cấp trong request
        if (request.getOrderStatus() != null && !request.getOrderStatus().isEmpty()) {
            order.setOrderStatus(request.getOrderStatus());
        }

        if (request.getPayStatus() != null && !request.getPayStatus().isEmpty()) {
            order.setPayStatus(request.getPayStatus());
        }

        if (request.getTrackingNumber() != null && !request.getTrackingNumber().isEmpty()) {
            order.setTrackingNumber(request.getTrackingNumber());
        }

        order.setUpdatedAt(LocalDateTime.now()); // Luôn cập nhật thời gian
        Order updatedOrder = orderRepository.save(order);

        return OrderResponseDTO.fromOrder(updatedOrder);
    }
}