// src/main/java/com/example/fashion/service/ReportService.java
package com.example.fashion.service;

import com.example.fashion.dto.ReportResponseDTO;
import com.example.fashion.entity.Order;
import com.example.fashion.entity.OrderItem;
import com.example.fashion.entity.Product;
import com.example.fashion.entity.User;
import com.example.fashion.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
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
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);

        Map<LocalDate, BigDecimal> revenueMap = new HashMap<>();
        Map<LocalDate, Long> orderCountMap = new HashMap<>();

        for (Order order : orders) {
            LocalDate date = order.getCreatedAt().toLocalDate();
            BigDecimal amount = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
            revenueMap.merge(date, amount, BigDecimal::add);
            orderCountMap.merge(date, 1L, Long::sum);
        }

        List<ReportResponseDTO.DailyRevenue> breakdown = new ArrayList<>();
        for (LocalDate date = start.toLocalDate(); !date.isAfter(end.toLocalDate()); date = date.plusDays(1)) {
            breakdown.add(ReportResponseDTO.DailyRevenue.builder()
                    .date(date)
                    .revenue(revenueMap.getOrDefault(date, BigDecimal.ZERO).doubleValue())
                    .orders(orderCountMap.getOrDefault(date, 0L).intValue())
                    .build());
        }

        BigDecimal totalRevenue = revenueMap.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        return ReportResponseDTO.RevenueReport.builder()
                .period(period)
                .totalRevenue(totalRevenue.doubleValue())
                // SỬA: Integer → Long
                .totalOrders((int) orders.size())
                .breakdown(breakdown)
                .build();
    }

    public ReportResponseDTO.OrderReport getOrderReport(LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);

        return ReportResponseDTO.OrderReport.builder()
                // SỬA: Integer → Long
                .total((long) orders.size())
                .completed(orders.stream().filter(o -> "COMPLETED".equals(o.getOrderStatus())).count())
                .cancelled(orders.stream().filter(o -> "CANCELLED".equals(o.getOrderStatus())).count())
                .pending(orders.stream().filter(o -> "PENDING".equals(o.getOrderStatus())).count())
                .build();
    }

    public List<ReportResponseDTO.TopProduct> getTopProducts(int limit) {
        return orderItemRepository.findTopSellingProducts(PageRequest.of(0, limit)).stream()
                .map(row -> {
                    Long variantId = (Long) row[0];
                    Long qty = (Long) row[1];
                    Double revenue = (Double) row[2];
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
                // SỬA: Integer → Long (nếu DTO dùng Long)
                .newCustomers((int) newCustomers) // hoặc .newCustomers(newCustomers) nếu DTO dùng Long
                .conversionRate(Math.round(conversionRate * 100.0) / 100.0)
                .totalUsers(totalUsers)
                .totalOrders(totalOrders)
                .build();
    }

    public byte[] generateExcelReport(String type, LocalDateTime start, LocalDateTime end) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Báo cáo");

            int rowNum = 0;
            Row header = sheet.createRow(rowNum++);
            header.createCell(0).setCellValue("Loại báo cáo: " + type.toUpperCase());
            if (start != null && end != null) {
                header.createCell(1).setCellValue("Từ: " + start + " → " + end);
            }
            rowNum++;

            if ("revenue".equalsIgnoreCase(type)) {
                ReportResponseDTO.RevenueReport report = getRevenueReport("day", start, end);
                Row title = sheet.createRow(rowNum++);
                title.createCell(0).setCellValue("DOANH THU THEO NGÀY");

                Row headerRow = sheet.createRow(rowNum++);
                headerRow.createCell(0).setCellValue("Ngày");
                headerRow.createCell(1).setCellValue("Doanh thu");
                headerRow.createCell(2).setCellValue("Số đơn");

                for (ReportResponseDTO.DailyRevenue item : report.getBreakdown()) {
                    Row row = sheet.createRow(rowNum++);
                    row.createCell(0).setCellValue(item.getDate().toString());
                    row.createCell(1).setCellValue(item.getRevenue());
                    row.createCell(2).setCellValue(item.getOrders());
                }

                Row total = sheet.createRow(rowNum++);
                total.createCell(0).setCellValue("TỔNG");
                total.createCell(1).setCellValue(report.getTotalRevenue());
                total.createCell(2).setCellValue(report.getTotalOrders());
            }

            for (int i = 0; i < 3; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo Excel: " + e.getMessage());
        }
    }
}