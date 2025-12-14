package com.example.fashion.service;

import com.example.fashion.dto.InventoryRequestDTO;
import com.example.fashion.dto.InventoryResponseDTO;
import com.example.fashion.entity.Inventory;
import com.example.fashion.entity.ProductVariant;
import com.example.fashion.entity.Warehouse;
import com.example.fashion.repository.InventoryRepository;
import com.example.fashion.repository.ProductVariantRepository;
import com.example.fashion.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductVariantRepository variantRepository;
    private final WarehouseRepository warehouseRepository;

    // ===================================================================
    // 1. LẤY TẤT CẢ TỒN KHO (180 records) – DÙNG CHO DASHBOARD
    // ===================================================================
    @Transactional(readOnly = true)
    public List<InventoryResponseDTO.LowStockItem> getAllStock() {
        log.info("Fetching ALL STOCK");

        List<ProductVariant> variants = variantRepository.findAll();
        List<Warehouse> warehouses = warehouseRepository.findAll();

        Map<String, Inventory> map = inventoryRepository.findAll().stream()
                .collect(HashMap::new,
                        (m, inv) -> m.put(inv.getVariant().getId() + "_" + inv.getWarehouse().getId(), inv),
                        HashMap::putAll);

        List<InventoryResponseDTO.LowStockItem> result = new ArrayList<>();

        for (ProductVariant v : variants) {
            for (Warehouse w : warehouses) {
                Inventory inv = map.get(v.getId() + "_" + w.getId());
                if (inv == null) inv = createTempInventory(v, w);

                result.add(InventoryResponseDTO.LowStockItem.builder()
                        .inventoryId(inv.getId())
                        .variantId(v.getId())
                        .sku(v.getSku())
                        .currentStock(inv.getQuantity())
                        .productName(v.getProduct() != null ? v.getProduct().getName() : "N/A")
                        .attributes(v.getAttributes() != null ? v.getAttributes().toString() : null)
                        .warehouseName(w.getName())
                        .isLowStock(inv.getQuantity() <= 10)
                        .build());
            }
        }

        result.sort(Comparator.comparingInt(i -> i.getCurrentStock() != null ? i.getCurrentStock() : 999));
        log.info("Generated {} stock items", result.size());
        return result;
    }

    // ===================================================================
    // 2. LẤY TỒN KHO THẤP
    // ===================================================================
    @Transactional(readOnly = true)
    public List<InventoryResponseDTO.LowStockItem> getLowStock() {
        return getAllStock().stream()
                .filter(i -> i.getCurrentStock() <= 10)
                .sorted(Comparator.comparingInt(InventoryResponseDTO.LowStockItem::getCurrentStock))
                .toList();
    }

    // ===================================================================
    // 3. LẤY TỒN KHO CỦA 1 VARIANT TRONG 1 KHO CỤ THỂ – DÙNG CHO FORM CẬP NHẬT
    // ===================================================================
    @Transactional(readOnly = true)
    public InventoryResponseDTO.StockInfo getStock(Long variantId, Long warehouseId) {
        return inventoryRepository.findByVariantIdAndWarehouseId(variantId, warehouseId)
                .map(inv -> InventoryResponseDTO.StockInfo.builder()
                        .inventoryId(inv.getId())
                        .variantId(variantId)
                        .sku(inv.getVariant().getSku())
                        .quantity(inv.getQuantity())
                        .productName(inv.getVariant().getProduct() != null ? inv.getVariant().getProduct().getName() : "N/A")
                        .warehouseName(inv.getWarehouse().getName())
                        .build())
                .orElse(InventoryResponseDTO.StockInfo.builder()
                        .inventoryId(null)
                        .variantId(variantId)
                        .sku(variantRepository.findById(variantId).map(ProductVariant::getSku).orElse("N/A"))
                        .quantity(0)
                        .productName("N/A")
                        .warehouseName(warehouseRepository.findById(warehouseId).map(Warehouse::getName).orElse("N/A"))
                        .build());
    }

    // ===================================================================
    // 4. Helper: tạo inventory tạm (không lưu DB)
    // ===================================================================
    private Inventory createTempInventory(ProductVariant variant, Warehouse warehouse) {
        Inventory temp = new Inventory();
        temp.setId(-1L);
        temp.setVariant(variant);
        temp.setWarehouse(warehouse);
        temp.setProductId(variant.getProduct() != null ? variant.getProduct().getId() : null);
        temp.setQuantity(0);
        temp.setLowStockThreshold(10);
        temp.setLastUpdated(LocalDateTime.now());
        return temp;
    }

    @Transactional(readOnly = true)
    public Integer getStockQuantity(Long variantId, Long warehouseId) {
        // Sử dụng hàm repository đã có sẵn: findByVariantIdAndWarehouseId
        return inventoryRepository.findByVariantIdAndWarehouseId(variantId, warehouseId)
                .map(Inventory::getQuantity) // Nếu tìm thấy -> lấy số lượng
                .orElse(0);                 // Nếu không thấy -> trả về 0
    }
    // ===================================================================
    // 5. CẬP NHẬT TỒN KHO – ĐÃ FIX LỖI product_id → HẾT 403
    // ===================================================================
    @Transactional
    public InventoryResponseDTO.UpdateSuccess updateStock(InventoryRequestDTO request) {
        try {
            ProductVariant variant = variantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new IllegalArgumentException("Variant không tồn tại"));

            Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                    .orElseThrow(() -> new IllegalArgumentException("Kho không tồn tại"));

            Long productId = variant.getProduct() != null ? variant.getProduct().getId() : null;
            if (productId == null) {
                throw new IllegalArgumentException("Variant chưa liên kết sản phẩm");
            }

            Inventory inventory = inventoryRepository
                    .findByVariantIdAndWarehouseId(request.getVariantId(), request.getWarehouseId())
                    .orElseGet(() -> {
                        Inventory newInv = new Inventory();
                        newInv.setVariant(variant);
                        newInv.setWarehouse(warehouse);
                        newInv.setProductId(productId);           // QUAN TRỌNG NHẤT
                        newInv.setQuantity(0);
                        newInv.setLowStockThreshold(10);
                        newInv.setLastUpdated(LocalDateTime.now());
                        return newInv;
                    });

            int oldQty = inventory.getQuantity();
            int newQty = "IN".equalsIgnoreCase(request.getAction())
                    ? oldQty + request.getQuantity()
                    : Math.max(0, oldQty - request.getQuantity());

            inventory.setQuantity(newQty);
            inventory.setLastUpdated(LocalDateTime.now());
            inventory.setProductId(productId);

            inventoryRepository.save(inventory);

            String action = "IN".equalsIgnoreCase(request.getAction()) ? "Nhập kho" : "Xuất kho";
            log.info("{} thành công: SKU={} | Kho={} | {} → {}", action, variant.getSku(), warehouse.getName(), oldQty, newQty);

            return InventoryResponseDTO.UpdateSuccess.builder()
                    .success(true)
                    .message(action + " thành công! Tồn kho mới: " + newQty)
                    .build();

        } catch (IllegalArgumentException e) {
            log.warn("Lỗi: {}", e.getMessage());
            return InventoryResponseDTO.UpdateSuccess.builder().success(false).message(e.getMessage()).build();
        } catch (Exception e) {
            log.error("Lỗi hệ thống", e);
            return InventoryResponseDTO.UpdateSuccess.builder().success(false).message("Lỗi hệ thống").build();
        }
    }
}