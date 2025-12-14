package com.example.fashion.service;

import com.example.fashion.repository.OrderRepository;
import com.example.fashion.repository.ProductRepository;
import com.example.fashion.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // 1. Tổng quan (Mock hoặc Query thật tùy bạn)
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalRevenue", 150000000); // Tạm fix cứng hoặc query sum
        stats.put("totalCustomers", userRepository.count());
        return stats;
    }

    // 2. Biểu đồ doanh thu (Dữ liệu giả lập để hiển thị đẹp)
    public List<Map<String, Object>> getRevenueChart(String period) {
        List<Map<String, Object>> data = new ArrayList<>();
        // Giả lập dữ liệu 5 ngày gần nhất
        for (int i = 4; i >= 0; i--) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", "Ngày " + (30 - i));
            point.put("revenue", 1000000 + (Math.random() * 5000000));
            data.add(point);
        }
        return data;
    }

    // 3. Đơn hàng gần đây (Dữ liệu giả lập)
    public List<Map<String, Object>> getRecentOrders(int limit) {
        List<Map<String, Object>> orders = new ArrayList<>();
        for (int i = 1; i <= limit; i++) {
            Map<String, Object> order = new HashMap<>();
            order.put("id", 1000 + i);
            order.put("customerName", "Khách hàng " + i);
            order.put("totalAmount", 500000 * i);
            order.put("status", i % 2 == 0 ? "COMPLETED" : "PENDING");
            order.put("createdAt", new Date());
            orders.add(order);
        }
        return orders;
    }

    // 4. Top sản phẩm (Dữ liệu giả lập)
    public List<Map<String, Object>> getTopSellingProducts(int limit) {
        List<Map<String, Object>> products = new ArrayList<>();
        for (int i = 1; i <= limit; i++) {
            Map<String, Object> p = new HashMap<>();
            p.put("name", "Sản phẩm Hot " + i);
            p.put("soldCount", 100 - (i * 10));
            products.add(p);
        }
        return products;
    }

    // 5. Tỷ lệ đơn hàng
    public Map<String, Object> getOrderStatusStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("completedPercent", 70);
        stats.put("pendingPercent", 20);
        stats.put("cancelledPercent", 10);
        return stats;
    }
}