package com.example.fashion.controller;

import com.example.fashion.dto.InventoryRequestDTO;
import com.example.fashion.dto.InventoryResponseDTO;
import com.example.fashion.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/inventory")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN') OR hasRole('ADMIN')")
public class AdminInventoryController {

    private final InventoryService inventoryService;

    /**
     * Cập nhật tồn kho
     * POST /api/v1/admin/inventory
     */
    @PostMapping
    public ResponseEntity<InventoryResponseDTO.UpdateSuccess> updateStock(
            @Valid @RequestBody InventoryRequestDTO request) {
        return ResponseEntity.ok(inventoryService.updateStock(request));
    }

    /**
     * Xem danh sách hàng sắp hết
     * GET /api/v1/admin/inventory/low-stock
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponseDTO.LowStockItem>> getLowStock() {
        return ResponseEntity.ok(inventoryService.getLowStock());
    }

    /**
     * Xem tồn kho 1 biến thể
     * GET /api/v1/admin/inventory/{variantId}
     */
    @GetMapping("/{variantId}")
    public ResponseEntity<InventoryResponseDTO.StockInfo> getStock(@PathVariable Long variantId) {
        return ResponseEntity.ok(inventoryService.getStock(variantId));
    }
}