package com.example.fashion.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor // Tạo constructor cho tất cả các trường
public class DashboardStatsDTO {
    private long totalCustomers; // Tổng số khách hàng
    private long totalOrders;    // Tổng số đơn hàng
    private double totalRevenue;   // Tổng doanh thu
}