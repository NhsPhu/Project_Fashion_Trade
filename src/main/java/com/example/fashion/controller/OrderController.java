package com.example.fashion.controller;

import com.example.fashion.dto.CheckoutRequest;
import com.example.fashion.entity.Order;
import com.example.fashion.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders") // Tiền tố chung cho khách hàng
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // <-- THÊM DÒNG NÀY: Cho phép React gọi API
public class OrderController {

    private final OrderService orderService; // Sẽ được tiêm (inject) ở bước sau

    /**
     * API này dành cho khách hàng thực hiện thanh toán
     * (Khớp với SecurityConfig: .requestMatchers("/api/v1/orders/checkout").permitAll())
     */
    @PostMapping("/checkout")
    public ResponseEntity<?> createOrder(@RequestBody CheckoutRequest request) {
        try {
            // Chúng ta sẽ viết hàm 'createOrder' trong OrderService ở bước tiếp theo
            Order newOrder = orderService.createOrder(request);
            return ResponseEntity.ok(newOrder); // Trả về thông tin đơn hàng đã tạo
        } catch (RuntimeException e) {
            // Trả về lỗi nếu có (ví dụ: hết hàng)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}