package com.example.fashion.controller;

import com.example.fashion.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    // 1. Thống kê tổng quan (Đã có)
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    // 2. Biểu đồ doanh thu
    @GetMapping("/revenue-chart")
    public ResponseEntity<?> getRevenueChart(@RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(dashboardService.getRevenueChart(period));
    }

    // 3. Đơn hàng mới nhất
    @GetMapping("/recent-orders")
    public ResponseEntity<?> getRecentOrders(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getRecentOrders(limit));
    }

    // 4. Top sản phẩm bán chạy
    @GetMapping("/top-products")
    public ResponseEntity<?> getTopProducts(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getTopSellingProducts(limit));
    }

    // 5. Thống kê trạng thái đơn hàng
    @GetMapping("/order-status-stats")
    public ResponseEntity<?> getOrderStatusStats() {
        return ResponseEntity.ok(dashboardService.getOrderStatusStats());
    }
}