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
                .totalOrders((int) orders.size())
                .breakdown(breakdown)
                .build();
    }

    public ReportResponseDTO.OrderReport getOrderReport(LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);

        return ReportResponseDTO.OrderReport.builder()
                .total((long) orders.size())
                // SỬA: Hỗ trợ nhiều trạng thái hoàn thành
                .completed(orders.stream()
                        .filter(o -> Set.of("PAID", "SHIPPED", "DELIVERED", "DONE", "COMPLETED").contains(o.getOrderStatus()))
                        .count())
                .cancelled(orders.stream().filter(o -> "CANCELLED".equals(o.getOrderStatus())).count())
                .pending(orders.stream()
                        .filter(o -> Set.of("PENDING", "PROCESSING", "CREATED").contains(o.getOrderStatus()))
                        .count())
                .build();
    }

    public List<ReportResponseDTO.TopProduct> getTopProducts(int limit) {
        return orderItemRepository.findTopSellingProducts(PageRequest.of(0, limit)).stream()
                .map(row -> {
                    try {
                        Long variantId = ((Number) row[0]).longValue();
                        Long qty = ((Number) row[1]).longValue();
                        Double revenue = ((Number) row[2]).doubleValue();

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
                    } catch (Exception e) {
                        System.err.println("Lỗi parse top product: " + e.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull)
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

    // =================== ĐÃ SỬA: THÊM XỬ LÝ TYPE = FULL ===================
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

            // ⭐ THÊM: Xử lý type = full
            if ("full".equalsIgnoreCase(type)) {
                generateFullReport(workbook, start, end);
            }
            // Giữ nguyên: chỉ xử lý revenue
            else if ("revenue".equalsIgnoreCase(type)) {
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

    // ⭐ THÊM: Hàm tạo báo cáo FULL (5 sheet riêng biệt)
    private void generateFullReport(Workbook workbook, LocalDateTime start, LocalDateTime end) {
        generateRevenueSheet(workbook, start, end);
        generateOrderSheet(workbook, start, end);
        generateTopProductsSheet(workbook);
        generateLowStockSheet(workbook);
        generateCustomerSheet(workbook, start, end);
    }

    private void generateRevenueSheet(Workbook workbook, LocalDateTime start, LocalDateTime end) {
        ReportResponseDTO.RevenueReport report = getRevenueReport("day", start, end);
        Sheet sheet = workbook.createSheet("Doanh thu");
        int rowNum = 0;

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

        for (int i = 0; i < 3; i++) sheet.autoSizeColumn(i);
    }

    private void generateOrderSheet(Workbook workbook, LocalDateTime start, LocalDateTime end) {
        ReportResponseDTO.OrderReport report = getOrderReport(start, end);
        Sheet sheet = workbook.createSheet("Đơn hàng");
        int rowNum = 0;

        Row row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("Tổng đơn"); row.createCell(1).setCellValue(report.getTotal());
        row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("Hoàn thành"); row.createCell(1).setCellValue(report.getCompleted());
        row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("Hủy"); row.createCell(1).setCellValue(report.getCancelled());
        row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("Chờ xử lý"); row.createCell(1).setCellValue(report.getPending());

        for (int i = 0; i < 2; i++) sheet.autoSizeColumn(i);
    }

    private void generateTopProductsSheet(Workbook workbook) {
        List<ReportResponseDTO.TopProduct> top = getTopProducts(10);
        Sheet sheet = workbook.createSheet("Top sản phẩm");
        int rowNum = 0;

        Row header = sheet.createRow(rowNum++);
        header.createCell(0).setCellValue("Sản phẩm");
        header.createCell(1).setCellValue("SKU");
        header.createCell(2).setCellValue("Số lượng");
        header.createCell(3).setCellValue("Doanh thu");

        for (ReportResponseDTO.TopProduct p : top) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(p.getProductName());
            row.createCell(1).setCellValue(p.getSku());
            row.createCell(2).setCellValue(p.getSoldQuantity());
            row.createCell(3).setCellValue(p.getRevenue());
        }

        for (int i = 0; i < 4; i++) sheet.autoSizeColumn(i);
    }

    private void generateLowStockSheet(Workbook workbook) {
        List<ReportResponseDTO.LowStockItem> low = getLowStock();
        Sheet sheet = workbook.createSheet("Tồn kho thấp");
        int rowNum = 0;

        Row header = sheet.createRow(rowNum++);
        header.createCell(0).setCellValue("Sản phẩm");
        header.createCell(1).setCellValue("SKU");
        header.createCell(2).setCellValue("Tồn kho");

        for (ReportResponseDTO.LowStockItem item : low) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(item.getProductName());
            row.createCell(1).setCellValue(item.getSku());
            row.createCell(2).setCellValue(item.getCurrentStock());
        }

        for (int i = 0; i < 3; i++) sheet.autoSizeColumn(i);
    }

    private void generateCustomerSheet(Workbook workbook, LocalDateTime start, LocalDateTime end) {
        ReportResponseDTO.CustomerReport report = getCustomerReport(start, end);
        Sheet sheet = workbook.createSheet("Khách hàng");
        int rowNum = 0;

        Row row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("Khách mới"); row.createCell(1).setCellValue(report.getNewCustomers());
        row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("Tổng khách"); row.createCell(1).setCellValue(report.getTotalUsers());
        row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue("Tỷ lệ chuyển đổi"); row.createCell(1).setCellValue(report.getConversionRate() + "%");

        for (int i = 0; i < 2; i++) sheet.autoSizeColumn(i);
    }
}