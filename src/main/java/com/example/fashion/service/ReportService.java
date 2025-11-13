// src/main/java/com/example/fashion/service/ReportService.java
package com.example.fashion.service;

import com.example.fashion.dto.ReportResponseDTO;
import com.example.fashion.entity.Order;
import com.example.fashion.entity.OrderItem;
import com.example.fashion.entity.Product;
import com.example.fashion.entity.User;
import com.example.fashion.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ReportResponseDTO.RevenueReport getRevenueReport(String period, LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findByCreatedAtBetweenAndOrderStatus(start, end, "COMPLETED");

        Map<LocalDate, List<Order>> grouped = orders.stream()
                .collect(Collectors.groupingBy(o -> o.getCreatedAt().toLocalDate()));

        List<ReportResponseDTO.DailyRevenue> breakdown = grouped.entrySet().stream()
                .map(entry -> ReportResponseDTO.DailyRevenue.builder()
                        .date(entry.getKey())
                        // SỬA: Dùng lambda thay method reference
                        .revenue(entry.getValue().stream()
                                .mapToDouble(o -> {
                                    BigDecimal amount = o.getFinalAmount();
                                    return amount != null ? amount.doubleValue() : 0.0;
                                })
                                .sum())
                        .orders(entry.getValue().size())
                        .build())
                .sorted(Comparator.comparing(ReportResponseDTO.DailyRevenue::getDate))
                .collect(Collectors.toList());

        double totalRevenue = breakdown.stream()
                .mapToDouble(ReportResponseDTO.DailyRevenue::getRevenue)
                .sum();

        return ReportResponseDTO.RevenueReport.builder()
                .period(period)
                .totalRevenue(totalRevenue)
                .totalOrders(orders.size())
                .breakdown(breakdown)
                .build();
    }

    public ReportResponseDTO.OrderReport getOrderReport(LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);

        return ReportResponseDTO.OrderReport.builder()
                .total((long) orders.size())
                // SỬA: Dùng lambda
                .completed(orders.stream()
                        .filter(o -> "COMPLETED".equals(o.getOrderStatus()))
                        .count())
                .cancelled(orders.stream()
                        .filter(o -> "CANCELLED".equals(o.getOrderStatus()))
                        .count())
                .pending(orders.stream()
                        .filter(o -> "PENDING".equals(o.getOrderStatus()))
                        .count())
                .build();
    }

    public List<ReportResponseDTO.TopProduct> getTopProducts(int limit) {
        return orderItemRepository.findTopSellingProducts(PageRequest.of(0, limit)).stream()
                .map(row -> {
                    Long variantId = (Long) row[0];
                    Long qty = (Long) row[1];
                    Double revenue = (Double) row[2]; // subtotal đã là Double
                    Product product = productRepository.findByVariantId(variantId).orElse(null);
                    String name = product != null ? product.getName() : "Không xác định";
                    String sku = variantRepository.findById(variantId)
                            .map(v -> v.getSku())
                            .orElse("N/A");

                    return ReportResponseDTO.TopProduct.builder()
                            .productId(product != null ? product.getId() : null)
                            .productName(name)
                            .sku(sku)
                            .soldQuantity(qty.intValue())
                            .revenue(revenue)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<ReportResponseDTO.LowStockItem> getLowStock() {
        return variantRepository.findByStockQuantityLessThanEqual(10).stream()
                .map(v -> ReportResponseDTO.LowStockItem.builder()
                        .variantId(v.getId())
                        .sku(v.getSku())
                        .currentStock(v.getStockQuantity())
                        .productName(v.getProduct() != null ? v.getProduct().getName() : "Không xác định")
                        .build())
                .collect(Collectors.toList());
    }

    public ReportResponseDTO.CustomerReport getCustomerReport(LocalDateTime start, LocalDateTime end) {
        long newCustomers = userRepository.countByCreatedAtBetween(start, end);
        long totalOrders = orderRepository.countByCreatedAtBetween(start, end);
        long totalUsers = userRepository.count();
        double conversionRate = totalUsers > 0 ? (double) totalOrders / totalUsers * 100 : 0;

        return ReportResponseDTO.CustomerReport.builder()
                .newCustomers((int) newCustomers)
                .conversionRate(Math.round(conversionRate * 100.0) / 100.0)
                .totalUsers(totalUsers)
                .totalOrders(totalOrders)
                .build();
    }
}