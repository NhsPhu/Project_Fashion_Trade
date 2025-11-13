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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductVariantRepository variantRepository;
    private final WarehouseRepository warehouseRepository;

    public InventoryResponseDTO.UpdateSuccess updateStock(InventoryRequestDTO request) {
        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Biến thể không tồn tại: ID = " + request.getVariantId()));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Kho không tồn tại: ID = " + request.getWarehouseId()));

        Inventory inventory = inventoryRepository
                .findByVariantIdAndWarehouseId(request.getVariantId(), request.getWarehouseId())
                .orElseGet(() -> {
                    Inventory newInv = new Inventory();
                    newInv.setVariant(variant);
                    newInv.setWarehouse(warehouse);
                    newInv.setQuantity(0);
                    return newInv;
                });

        int oldQty = inventory.getQuantity();
        int newQty = switch (request.getAction()) {
            case "IN" -> oldQty + request.getQuantity();
            case "OUT" -> {
                if (oldQty < request.getQuantity()) {
                    throw new RuntimeException("Không đủ hàng để xuất kho");
                }
                yield oldQty - request.getQuantity();
            }
            case "TRANSFER" -> oldQty; // Dùng khi điều chuyển
            default -> throw new IllegalArgumentException("Hành động không hợp lệ: " + request.getAction());
        };

        inventory.setQuantity(newQty);
        inventory.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(inventory);

        return InventoryResponseDTO.UpdateSuccess.builder()
                .message(String.format("%s kho thành công: %d → %d",
                        request.getAction().equals("IN") ? "Nhập" : "Xuất",
                        oldQty, newQty))
                .build();
    }

    @Transactional(readOnly = true)
    public List<InventoryResponseDTO.LowStockItem> getLowStock() {
        return inventoryRepository.findByQuantityLessThanEqual(10).stream()
                .map(inv -> InventoryResponseDTO.LowStockItem.builder()
                        .inventoryId(inv.getId())
                        .variantId(inv.getVariant().getId())
                        .sku(inv.getVariant().getSku())
                        .currentStock(inv.getQuantity())
                        .productName(inv.getVariant().getProduct() != null ? inv.getVariant().getProduct().getName() : "N/A")
                        .attributes(inv.getVariant().getAttributes())
                        .warehouseName(inv.getWarehouse().getName())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public InventoryResponseDTO.StockInfo getStock(Long variantId, Long warehouseId) {
        Inventory inv = inventoryRepository.findByVariantIdAndWarehouseId(variantId, warehouseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho"));

        return InventoryResponseDTO.StockInfo.builder()
                .inventoryId(inv.getId())
                .variantId(inv.getVariant().getId())
                .sku(inv.getVariant().getSku())
                .quantity(inv.getQuantity())
                .productName(inv.getVariant().getProduct() != null ? inv.getVariant().getProduct().getName() : "N/A")
                .warehouseName(inv.getWarehouse().getName())
                .build();
    }
}