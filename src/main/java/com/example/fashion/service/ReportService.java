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

            BigDecimal amount = o.getFinalAmount() != null ? o.getFinalAmount() :
                    (o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO);

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

        BigDecimal total = revenueMap.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ReportResponseDTO.RevenueReport.builder()
                .period(period)
                .totalRevenue(total.doubleValue())
                .totalOrders(orders.size())
                .breakdown(breakdown)
                .build();
    }

    // ======================= THỐNG KÊ ĐƠN HÀNG =======================
    public ReportResponseDTO.OrderReport getOrderReport(LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);
        return ReportResponseDTO.OrderReport.builder()
                .total((long) orders.size())
                .completed(orders.stream()
                        .filter(o -> Set.of("PAID", "SHIPPED", "DELIVERED", "DONE", "COMPLETED")
                                .contains(o.getOrderStatus()))
                        .count())
                .cancelled(orders.stream()
                        .filter(o -> "CANCELLED".equals(o.getOrderStatus()))
                        .count())
                .pending(orders.stream()
                        .filter(o -> Set.of("PENDING", "PROCESSING", "CREATED")
                                .contains(o.getOrderStatus()))
                        .count())
                .build();
    }

    // ======================= TOP SẢN PHẨM BÁN CHẠY =======================
    public List<ReportResponseDTO.TopProduct> getTopProducts(int limit) {
        // Group bằng variant, tính tổng số lượng bán và doanh thu
        return orderItemRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        OrderItem::getVariant,
                        Collectors.summingInt(OrderItem::getQuantity)
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<ProductVariant, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> {
                    ProductVariant variant = entry.getKey();
                    Integer soldQuantity = entry.getValue();

                    // Tính doanh thu cho variant này (subtotal từ order items)
                    BigDecimal revenue = orderItemRepository.findByVariant(variant).stream()
                            .map(oi -> oi.getSubtotal() != null ? oi.getSubtotal() : BigDecimal.ZERO)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return ReportResponseDTO.TopProduct.builder()
                            .productId(variant.getProduct().getId())
                            .productName(variant.getProduct().getName())
                            .sku(variant.getSku())
                            .soldQuantity(soldQuantity)
                            .revenue(revenue.doubleValue())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // ======================= TỒN KHO THẤP =======================
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

    // ======================= THỐNG KÊ KHÁCH HÀNG =======================
    public ReportResponseDTO.CustomerReport getCustomerReport(LocalDateTime start, LocalDateTime end) {
        List<Order> ordersInPeriod = orderRepository.findByCreatedAtBetween(start, end);
        long totalOrders = ordersInPeriod.size();
        long totalUsers = userRepository.count();

        long newCustomers = ordersInPeriod.stream()
                .map(Order::getUser)
                .filter(Objects::nonNull)
                .map(User::getId)
                .distinct()
                .count();

        double conversionRate = totalOrders > 0 ? (double) newCustomers / totalOrders * 100 : 0.0;

        return ReportResponseDTO.CustomerReport.builder()
                .newCustomers((int) newCustomers)
                .conversionRate(conversionRate)
                .totalUsers(totalUsers)
                .totalOrders(totalOrders)
                .build();
    }

    // ======================= XUẤT EXCEL - ĐÃ THÊM 2 SHEET MỚI =======================
    public byte[] generateExcelReport(String type, LocalDateTime start, LocalDateTime end) {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            if ("full".equalsIgnoreCase(type)) {
                generateRevenueSheet(wb, start, end);
                generateOrdersSheet(wb, start, end);  // THÊM: Sheet Đơn hàng
                generateOrderItemsSheet(wb, start, end);  // THÊM: Sheet Chi tiết SP
                generateTopProductsSheet(wb);
                generateLowStockSheet(wb);
                generateCustomerSheet(wb, start, end);
            }
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo file Excel", e);
        }
    }

    private void generateRevenueSheet(Workbook wb, LocalDateTime start, LocalDateTime end) {
        ReportResponseDTO.RevenueReport report = getRevenueReport("day", start, end);
        Sheet sheet = wb.createSheet("Doanh thu");
        CellStyle money = wb.createCellStyle();
        DataFormat format = wb.createDataFormat();
        money.setDataFormat(format.getFormat("#,##0"));

        int row = 0;
        sheet.createRow(row++).createCell(0).setCellValue("BÁO CÁO DOANH THU");
        sheet.createRow(row++).createCell(0).setCellValue("Từ ngày: " + start.toLocalDate() + " đến " + end.toLocalDate());
        sheet.createRow(row++).createCell(0).setCellValue("Tổng doanh thu"); sheet.getRow(row - 1).createCell(1).setCellValue(report.getTotalRevenue());
        sheet.getRow(row - 1).getCell(1).setCellStyle(money);
        sheet.createRow(row++).createCell(0).setCellValue("Tổng đơn hàng"); sheet.getRow(row - 1).createCell(1).setCellValue(report.getTotalOrders());

        row++;
        Row header = sheet.createRow(row++);
        header.createCell(0).setCellValue("Ngày");
        header.createCell(1).setCellValue("Doanh thu");
        header.createCell(2).setCellValue("Số đơn");

        for (ReportResponseDTO.DailyRevenue d : report.getBreakdown()) {
            Row r = sheet.createRow(row++);
            r.createCell(0).setCellValue(d.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            Cell c = r.createCell(1); c.setCellValue(d.getRevenue()); c.setCellStyle(money);
            r.createCell(2).setCellValue(d.getOrders());
        }
        for (int i = 0; i < 3; i++) sheet.autoSizeColumn(i);
    }

    // THÊM MỚI: Sheet Đơn hàng (tương tự file 17)
    private void generateOrdersSheet(Workbook wb, LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);
        Sheet sheet = wb.createSheet("Đơn hàng");

        CellStyle money = wb.createCellStyle();
        DataFormat format = wb.createDataFormat();
        money.setDataFormat(format.getFormat("#,##0"));

        int row = 0;
        sheet.createRow(row++).createCell(0).setCellValue("DANH SÁCH ĐƠN HÀNG");

        Row header = sheet.createRow(row++);
        header.createCell(0).setCellValue("Mã đơn");
        header.createCell(1).setCellValue("Ngày");
        header.createCell(2).setCellValue("Khách");
        header.createCell(3).setCellValue("SĐT");
        header.createCell(4).setCellValue("Trạng thái");
        header.createCell(5).setCellValue("Tổng tiền");
        header.createCell(6).setCellValue("Phí ship");
        header.createCell(7).setCellValue("Giảm giá");
        header.createCell(8).setCellValue("Ghi chú");

        for (Order o : orders) {
            Row r = sheet.createRow(row++);
            r.createCell(0).setCellValue(o.getOrderNo() != null ? o.getOrderNo() : "ORD-" + o.getId());
            r.createCell(1).setCellValue(o.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            r.createCell(2).setCellValue(o.getCustomerName() != null ? o.getCustomerName() : "Khách lẻ");
            r.createCell(3).setCellValue(o.getShippingPhone() != null ? o.getShippingPhone() : "");
            r.createCell(4).setCellValue(formatStatus(o.getOrderStatus()));
            Cell total = r.createCell(5); total.setCellValue(o.getFinalAmount() != null ? o.getFinalAmount().doubleValue() : (o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0)); total.setCellStyle(money);
            Cell ship = r.createCell(6); ship.setCellValue(o.getShippingFee() != null ? o.getShippingFee().doubleValue() : 0); ship.setCellStyle(money);
            Cell disc = r.createCell(7); disc.setCellValue(o.getDiscountAmount() != null ? o.getDiscountAmount().doubleValue() : 0); disc.setCellStyle(money);
            r.createCell(8).setCellValue("");  // Ghi chú nếu có
        }

        for (int i = 0; i < 9; i++) sheet.autoSizeColumn(i);
    }

    // THÊM MỚI: Sheet Chi tiết SP (tương tự file 17)
    private void generateOrderItemsSheet(Workbook wb, LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);
        List<OrderItem> items = orders.stream().flatMap(o -> o.getItems().stream()).collect(Collectors.toList());
        Sheet sheet = wb.createSheet("Chi tiết SP");

        CellStyle money = wb.createCellStyle();
        DataFormat format = wb.createDataFormat();
        money.setDataFormat(format.getFormat("#,##0"));

        int row = 0;
        sheet.createRow(row++).createCell(0).setCellValue("CHI TIẾT SẢN PHẨM TRONG ĐƠN");

        Row header = sheet.createRow(row++);
        header.createCell(0).setCellValue("Mã đơn");
        header.createCell(1).setCellValue("Ngày");
        header.createCell(2).setCellValue("Sản phẩm");
        header.createCell(3).setCellValue("SL");
        header.createCell(4).setCellValue("Giá");
        header.createCell(5).setCellValue("Thành tiền");

        for (OrderItem oi : items) {
            Order o = oi.getOrder();
            Row r = sheet.createRow(row++);
            r.createCell(0).setCellValue(o.getOrderNo() != null ? o.getOrderNo() : "ORD-" + o.getId());
            r.createCell(1).setCellValue(o.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            r.createCell(2).setCellValue(oi.getProductName() != null ? oi.getProductName() : "");
            r.createCell(3).setCellValue(oi.getQuantity() != null ? oi.getQuantity() : 0);
            Cell price = r.createCell(4); price.setCellValue(oi.getUnitPrice() != null ? oi.getUnitPrice().doubleValue() : 0); price.setCellStyle(money);
            Cell sub = r.createCell(5); sub.setCellValue(oi.getSubtotal() != null ? oi.getSubtotal().doubleValue() : 0); sub.setCellStyle(money);
        }

        for (int i = 0; i < 6; i++) sheet.autoSizeColumn(i);
    }

    private void generateTopProductsSheet(Workbook wb) {
        List<ReportResponseDTO.TopProduct> list = getTopProducts(10);
        Sheet sheet = wb.createSheet("Top sản phẩm");

        CellStyle money = wb.createCellStyle();
        DataFormat format = wb.createDataFormat();
        money.setDataFormat(format.getFormat("#,##0"));

        int row = 0;
        sheet.createRow(row++).createCell(0).setCellValue("TOP 10 SẢN PHẨM BÁN CHẠY");
        Row h = sheet.createRow(row++);
        h.createCell(0).setCellValue("STT"); h.createCell(1).setCellValue("Sản phẩm");
        h.createCell(2).setCellValue("SKU"); h.createCell(3).setCellValue("SL bán");
        h.createCell(4).setCellValue("Doanh thu");

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
        sheet.createRow(row++).createCell(0).setCellValue("Khoảng thời gian: " + start.toLocalDate() + " → " + end.toLocalDate());
        sheet.createRow(row++).createCell(0).setCellValue("Khách mới");   sheet.getRow(row-1).createCell(1).setCellValue(r.getNewCustomers());
        sheet.createRow(row++).createCell(0).setCellValue("Tổng khách"); sheet.getRow(row-1).createCell(1).setCellValue(r.getTotalUsers());
        sheet.createRow(row++).createCell(0).setCellValue("Tỷ lệ chuyển đổi"); sheet.getRow(row-1).createCell(1).setCellValue(String.format("%.2f%%", r.getConversionRate()));

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