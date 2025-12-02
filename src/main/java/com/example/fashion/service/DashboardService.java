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
        long totalCustomers = userRepository.countByRolesContains(Role.CUSTOMER);

        long totalOrders = orderRepository.count();

        Double totalRevenue = orderRepository.findTotalRevenue();

        return new DashboardStatsDTO(
                totalCustomers,
                totalOrders,
                totalRevenue != null ? totalRevenue : 0.0
        );
    }
}