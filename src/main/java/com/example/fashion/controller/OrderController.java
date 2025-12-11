package com.example.fashion.controller;

import com.example.fashion.dto.CheckoutRequestDTO; // SỬA: DÙNG DTO ĐÚNG
import com.example.fashion.entity.Order;
import com.example.fashion.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> createOrder(@RequestBody CheckoutRequestDTO request) {
        try {
            Order newOrder = orderService.createOrder(request); // ĐÃ ĐÚNG
            return ResponseEntity.ok(newOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}