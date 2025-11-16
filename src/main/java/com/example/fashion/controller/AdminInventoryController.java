// src/main/java/com/example/fashion/controller/AdminInventoryController.java
package com.example.fashion.controller;

import com.example.fashion.dto.InventoryRequestDTO;
import com.example.fashion.dto.InventoryResponseDTO;
import com.example.fashion.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Đảm bảo import này
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/inventory")
@RequiredArgsConstructor
// SỬA LỖI: Dùng vai trò có thật (PRODUCT_MANAGER) thay vì 'ADMIN'
// Thêm hasAnyRole để khớp với SecurityConfig
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRODUCT_MANAGER')")
public class AdminInventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<InventoryResponseDTO.UpdateSuccess> updateStock(
            @Valid @RequestBody InventoryRequestDTO request) {
        return ResponseEntity.ok(inventoryService.updateStock(request));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponseDTO.LowStockItem>> getLowStock() {
        return ResponseEntity.ok(inventoryService.getLowStock());
    }

    @GetMapping("/{variantId}/{warehouseId}")
    public ResponseEntity<InventoryResponseDTO.StockInfo> getStock(
            @PathVariable Long variantId,
            @PathVariable Long warehouseId) {
        return ResponseEntity.ok(inventoryService.getStock(variantId, warehouseId));
    }
}