package com.example.fashion.controller;

import com.example.fashion.dto.CheckoutRequestDTO;
import com.example.fashion.dto.OrderDTO;
import com.example.fashion.entity.Order;
import com.example.fashion.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> createOrder(@RequestBody CheckoutRequestDTO request) {
        try {
            Order newOrder = orderService.createOrder(request);
            return ResponseEntity.ok(newOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        // SỬA: Gọi phương thức mới getOrderDetailsForUser
        OrderDTO order = orderService.getOrderDetailsForUser(orderId);
        return ResponseEntity.ok(order);
    }
}