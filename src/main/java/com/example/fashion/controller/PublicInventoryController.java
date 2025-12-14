package com.example.fashion.controller;

import com.example.fashion.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/inventory") // Đường dẫn công khai
public class PublicInventoryController {

    private final InventoryService inventoryService;

    public PublicInventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * API xem tồn kho công khai (Không cần quyền Admin)
     * GET /api/v1/public/inventory/{variantId}
     */
    @GetMapping("/{variantId}")
    public ResponseEntity<Integer> getPublicStock(@PathVariable Long variantId) {
        // Gọi service lấy số lượng tồn kho (bạn có thể fix cứng warehouseId = 1 hoặc cộng dồn)
        // Giả sử lấy từ kho mặc định ID = 1
        Integer quantity = inventoryService.getStockQuantity(variantId, 1L);

        // Nếu null thì trả về 0
        return ResponseEntity.ok(quantity != null ? quantity : 0);
    }
}