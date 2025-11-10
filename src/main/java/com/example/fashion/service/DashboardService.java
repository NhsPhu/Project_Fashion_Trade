package com.example.fashion.service;

import com.example.fashion.dto.DashboardStatsDTO;
import com.example.fashion.enums.Role;
import com.example.fashion.repository.OrderRepository;
import com.example.fashion.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public DashboardService(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        // 1. Đếm tổng khách hàng (chỉ vai trò CUSTOMER)
        long totalCustomers = userRepository.countByRolesContains(Role.CUSTOMER);

        // 2. Đếm tổng số đơn hàng
        long totalOrders = orderRepository.count();

        // 3. Lấy tổng doanh thu (từ các đơn 'Delivered')
        Double totalRevenue = orderRepository.findTotalRevenue();

        return new DashboardStatsDTO(
                totalCustomers,
                totalOrders,
                totalRevenue != null ? totalRevenue : 0.0
        );
    }
}