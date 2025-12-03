// src/main/java/com/example/fashion/service/ReportService.java
package com.example.fashion.service;

import com.example.fashion.dto.ReportResponseDTO;
import com.example.fashion.entity.*;
import com.example.fashion.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    private final InventoryRepository inventoryRepository;

    // ======================= DOANH THU =======================
    public ReportResponseDTO.RevenueReport getRevenueReport(String period, LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);

        Map<LocalDate, BigDecimal> revenueMap = new HashMap<>();
        Map<LocalDate, Long> orderCountMap = new HashMap<>();

        for (Order o : orders) {
            LocalDate date = o.getCreatedAt().toLocalDate();
            BigDecimal amount = o.getFinalAmount() != null ? o.getFinalAmount() : BigDecimal.ZERO;
            revenueMap.merge(date, amount, BigDecimal::add);
            orderCountMap.merge(date, 1L, Long::sum);
        }

        List<ReportResponseDTO.DailyRevenue> breakdown = new ArrayList<>();
        LocalDate cur = start.toLocalDate();
        while (!cur.isAfter(end.toLocalDate())) {
            breakdown.add(ReportResponseDTO.DailyRevenue.builder()
                    .date(cur)
                    .revenue(revenueMap.getOrDefault(cur, BigDecimal.ZERO).doubleValue())
                    .orders(orderCountMap.getOrDefault(cur, 0L).intValue())
                    .build());
            cur = cur.plusDays(1);
        }

        BigDecimal total = revenueMap.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        return ReportResponseDTO.RevenueReport.builder()
                .period(period)
                .totalRevenue(total.doubleValue())
                .totalOrders(orders.size())
                .breakdown(breakdown)
                .build();
    }

    public ReportResponseDTO.OrderReport getOrderReport(LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);
        return ReportResponseDTO.OrderReport.builder()
                .total((long) orders.size())
                .completed(orders.stream().filter(o -> Set.of("PAID", "SHIPPED", "DELIVERED", "DONE", "COMPLETED").contains(o.getOrderStatus())).count())
                .cancelled(orders.stream().filter(o -> "CANCELLED".equals(o.getOrderStatus())).count())
                .pending(orders.stream().filter(o -> Set.of("PENDING", "PROCESSING", "CREATED").contains(o.getOrderStatus())).count())
                .build();
    }

    // ======================= TOP SẢN PHẨM – TỪ 5 SP TRỞ LÊN =======================
    public List<ReportResponseDTO.TopProduct> getTopProducts(int limit) {
        return orderItemRepository.findAll().stream()
                .filter(oi -> oi.getVariant() != null && oi.getVariant().getProduct() != null)
                .collect(Collectors.groupingBy(OrderItem::getVariant, Collectors.summingInt(OrderItem::getQuantity)))
                .entrySet().stream()
                .filter(e -> e.getValue() >= 5)
                .sorted(Map.Entry.<ProductVariant, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(e -> {
                    ProductVariant v = e.getKey();
                    int sold = e.getValue();
                    double revenue = sold * (v.getPrice() != null ? v.getPrice().doubleValue() : 0);
                    return ReportResponseDTO.TopProduct.builder()
                            .productName(v.getProduct().getName())
                            .sku(v.getSku())
                            .soldQuantity(sold)
                            .revenue(revenue)
                            .build();
                })
                .collect(Collectors.toList());
    }

    // ======================= TỒN KHO THẤP – HIỆN ĐẦY ĐỦ 19 SP =======================
    public List<ReportResponseDTO.LowStockItem> getLowStock() {
        return inventoryRepository.findAll().stream()
                .filter(inv -> inv.getQuantity() <= 10)
                .map(inv -> ReportResponseDTO.LowStockItem.builder()
                        .variantId(inv.getVariant().getId())
                        .sku(inv.getVariant().getSku())
                        .currentStock(inv.getQuantity())
                        .productName(inv.getVariant().getProduct() != null ? inv.getVariant().getProduct().getName() : "Không xác định")
                        .build())
                .sorted(Comparator.comparingInt(ReportResponseDTO.LowStockItem::getCurrentStock))
                .collect(Collectors.toList());
    }

    public ReportResponseDTO.CustomerReport getCustomerReport(LocalDateTime start, LocalDateTime end) {
        long newCust = userRepository.countByCreatedAtBetween(start, end);
        long totalOrders = orderRepository.countByCreatedAtBetween(start, end);
        long totalUsers = userRepository.count();
        double rate = totalUsers > 0 ? (double) totalOrders / totalUsers * 100 : 0;

        return ReportResponseDTO.CustomerReport.builder()
                .newCustomers((int) newCust)
                .totalUsers(totalUsers)
                .totalOrders(totalOrders)
                .conversionRate(Math.round(rate * 100.0) / 100.0)
                .build();
    }

    // ======================= XUẤT EXCEL =======================
    public byte[] generateExcelReport(String type, LocalDateTime start, LocalDateTime end) {
        try (Workbook wb = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            generateFullReport(wb, start, end);
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo Excel: " + e.getMessage(), e);
        }
    }

    private void generateFullReport(Workbook wb, LocalDateTime start, LocalDateTime end) {
        generateRevenueSheet(wb, start, end);
        generateOrdersSheet(wb, start, end);
        generateOrderItemsSheet(wb, start, end);
        generateTopProductsSheet(wb);
        generateLowStockSheet(wb);
        generateCustomerSheet(wb, start, end);
    }

    // ==================== CÁC SHEET – ĐÃ ĐẦY ĐỦ =====================
    private void generateRevenueSheet(Workbook wb, LocalDateTime start, LocalDateTime end) {
        ReportResponseDTO.RevenueReport r = getRevenueReport("day", start, end);
        Sheet sheet = wb.createSheet("Doanh thu");

        CellStyle money = wb.createCellStyle();
        money.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
        DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        int row = 0;
        sheet.createRow(row++).createCell(0).setCellValue("DOANH THU THEO NGÀY");
        Row h = sheet.createRow(row++);
        h.createCell(0).setCellValue("Ngày"); h.createCell(1).setCellValue("Doanh thu"); h.createCell(2).setCellValue("Số đơn");

        for (ReportResponseDTO.DailyRevenue d : r.getBreakdown()) {
            if (d.getRevenue() > 0 || d.getOrders() > 0) {
                Row rx = sheet.createRow(row++);
                rx.createCell(0).setCellValue(d.getDate().format(df));
                Cell c = rx.createCell(1); c.setCellValue(d.getRevenue()); c.setCellStyle(money);
                rx.createCell(2).setCellValue(d.getOrders());
            }
        }
        Row tot = sheet.createRow(row++);
        tot.createCell(0).setCellValue("TỔNG");
        Cell t = tot.createCell(1); t.setCellValue(r.getTotalRevenue()); t.setCellStyle(money);
        tot.createCell(2).setCellValue(r.getTotalOrders());
        for (int i = 0; i < 3; i++) sheet.autoSizeColumn(i);
    }

    private void generateOrdersSheet(Workbook wb, LocalDateTime start, LocalDateTime end) {
        List<Order> list = orderRepository.findByCreatedAtBetween(start, end);
        Sheet sheet = wb.createSheet("Đơn hàng");

        CellStyle money = wb.createCellStyle();
        money.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
        DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        int row = 0;
        sheet.createRow(row++).createCell(0).setCellValue("DANH SÁCH ĐƠN HÀNG");
        Row h = sheet.createRow(row++);
        String[] cols = {"Mã đơn","Ngày","Khách","SĐT","Trạng thái","Tổng tiền","Phí ship","Giảm giá","Ghi chú"};
        for (int i = 0; i < cols.length; i++) h.createCell(i).setCellValue(cols[i]);

        for (Order o : list) {
            Row rx = sheet.createRow(row++);
            rx.createCell(0).setCellValue(o.getOrderNo());
            rx.createCell(1).setCellValue(o.getCreatedAt().format(df));
            rx.createCell(2).setCellValue(o.getCustomerName() != null ? o.getCustomerName() : "Khách lẻ");
            rx.createCell(3).setCellValue(o.getShippingPhone() != null ? o.getShippingPhone() : "");
            rx.createCell(4).setCellValue(formatStatus(o.getOrderStatus()));

            Cell tot = rx.createCell(5); tot.setCellValue(o.getFinalAmount() != null ? o.getFinalAmount().doubleValue() : 0); tot.setCellStyle(money);
            Cell ship = rx.createCell(6); ship.setCellValue(o.getShippingFee() != null ? o.getShippingFee().doubleValue() : 0); ship.setCellStyle(money);
            Cell disc = rx.createCell(7); disc.setCellValue(o.getDiscountAmount() != null ? o.getDiscountAmount().doubleValue() : 0); disc.setCellStyle(money);

            try {
                java.lang.reflect.Method m = o.getClass().getMethod("getNote");
                String note = (String) m.invoke(o);
                rx.createCell(8).setCellValue(note != null ? note : "");
            } catch (Exception ignored) {
                rx.createCell(8).setCellValue("");
            }
        }
        for (int i = 0; i < cols.length; i++) sheet.autoSizeColumn(i);
    }

    private void generateOrderItemsSheet(Workbook wb, LocalDateTime start, LocalDateTime end) {
        List<Order> list = orderRepository.findByCreatedAtBetween(start, end);
        Sheet sheet = wb.createSheet("Chi tiết SP");

        CellStyle money = wb.createCellStyle();
        money.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
        DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        int row = 0;
        sheet.createRow(row++).createCell(0).setCellValue("CHI TIẾT SẢN PHẨM TRONG ĐƠN");
        Row h = sheet.createRow(row++);
        String[] cols = {"Mã đơn","Ngày","Sản phẩm","SL","Giá","Thành tiền"};
        for (int i = 0; i < cols.length; i++) h.createCell(i).setCellValue(cols[i]);

        for (Order o : list) {
            for (OrderItem oi : o.getItems()) {
                Row rx = sheet.createRow(row++);
                rx.createCell(0).setCellValue(o.getOrderNo());
                rx.createCell(1).setCellValue(o.getCreatedAt().format(df));
                rx.createCell(2).setCellValue(oi.getProductName());
                rx.createCell(3).setCellValue(oi.getQuantity());
                Cell p = rx.createCell(4); p.setCellValue(oi.getUnitPrice().doubleValue()); p.setCellStyle(money);
                Cell t = rx.createCell(5); t.setCellValue(oi.getSubtotal().doubleValue()); t.setCellStyle(money);
            }
        }
        for (int i = 0; i < cols.length; i++) sheet.autoSizeColumn(i);
    }

    private void generateTopProductsSheet(Workbook wb) {
        List<ReportResponseDTO.TopProduct> list = getTopProducts(20);
        Sheet sheet = wb.createSheet("Top sản phẩm");

        CellStyle money = wb.createCellStyle();
        money.setDataFormat(wb.createDataFormat().getFormat("#,##0"));

        int row = 0;
        sheet.createRow(row++).createCell(0).setCellValue("TOP 20 SẢN PHẨM BÁN CHẠY (từ 5 sp trở lên)");
        Row h = sheet.createRow(row++);
        h.createCell(0).setCellValue("STT"); h.createCell(1).setCellValue("Sản phẩm"); h.createCell(2).setCellValue("SKU");
        h.createCell(3).setCellValue("SL bán"); h.createCell(4).setCellValue("Doanh thu");

        int stt = 1;
        for (ReportResponseDTO.TopProduct p : list) {
            Row rx = sheet.createRow(row++);
            rx.createCell(0).setCellValue(stt++);
            rx.createCell(1).setCellValue(p.getProductName());
            rx.createCell(2).setCellValue(p.getSku());
            rx.createCell(3).setCellValue(p.getSoldQuantity());
            Cell c = rx.createCell(4); c.setCellValue(p.getRevenue()); c.setCellStyle(money);
        }
        for (int i = 0; i < 5; i++) sheet.autoSizeColumn(i);
    }

    private void generateLowStockSheet(Workbook wb) {
        List<ReportResponseDTO.LowStockItem> list = getLowStock();
        Sheet sheet = wb.createSheet("Tồn kho thấp");

        int row = 0;
        sheet.createRow(row++).createCell(0).setCellValue("SẢN PHẨM SẮP HẾT HÀNG (≤10)");
        Row h = sheet.createRow(row++);
        h.createCell(0).setCellValue("Sản phẩm"); h.createCell(1).setCellValue("SKU"); h.createCell(2).setCellValue("Tồn kho");

        CellStyle redStyle = null;
        for (ReportResponseDTO.LowStockItem item : list) {
            Row rx = sheet.createRow(row++);
            rx.createCell(0).setCellValue(item.getProductName());
            rx.createCell(1).setCellValue(item.getSku());
            Cell cell = rx.createCell(2);
            cell.setCellValue(item.getCurrentStock());

            if (item.getCurrentStock() <= 3) {
                if (redStyle == null) {
                    redStyle = wb.createCellStyle();
                    Font font = wb.createFont();
                    font.setColor(IndexedColors.RED.getIndex());
                    font.setBold(true);
                    redStyle.setFont(font);
                }
                cell.setCellStyle(redStyle);
            }
        }

        if (list.isEmpty()) {
            sheet.createRow(row).createCell(0).setCellValue("Không có sản phẩm nào sắp hết hàng");
        }
        for (int i = 0; i < 3; i++) sheet.autoSizeColumn(i);
    }

    private void generateCustomerSheet(Workbook wb, LocalDateTime start, LocalDateTime end) {
        ReportResponseDTO.CustomerReport r = getCustomerReport(start, end);
        Sheet sheet = wb.createSheet("Khách hàng");

        int row = 0;
        sheet.createRow(row++).createCell(0).setCellValue("THỐNG KÊ KHÁCH HÀNG");
        sheet.createRow(row++).createCell(0).setCellValue("Khách mới");   sheet.getRow(row-1).createCell(1).setCellValue(r.getNewCustomers());
        sheet.createRow(row++).createCell(0).setCellValue("Tổng khách"); sheet.getRow(row-1).createCell(1).setCellValue(r.getTotalUsers());
        sheet.createRow(row++).createCell(0).setCellValue("Tỷ lệ chuyển đổi"); sheet.getRow(row-1).createCell(1).setCellValue(r.getConversionRate() + "%");

        for (int i = 0; i < 2; i++) sheet.autoSizeColumn(i);
    }

    private String formatStatus(String s) {
        if (s == null) return "";
        return switch (s) {
            case "PENDING", "CREATED" -> "Chờ xử lý";
            case "PAID" -> "Đã thanh toán";
            case "PROCESSING" -> "Đang xử lý";
            case "SHIPPED" -> "Đang giao";
            case "DELIVERED" -> "Đã giao";
            case "DONE", "COMPLETED" -> "Hoàn thành";
            case "CANCELLED" -> "Đã hủy";
            default -> s;
        };
    }
}