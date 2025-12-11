// src/main/java/com/example/fashion/controller/AdminWarehouseController.java
package com.example.fashion.controller;

import com.example.fashion.dto.WarehouseResponseDTO;
import com.example.fashion.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/warehouses")
@RequiredArgsConstructor
// SỬA ĐÂY: Dùng hasAnyRole thay vì hasRole, và thêm PRODUCT_MANAGER nếu cần
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRODUCT_MANAGER')")
public class AdminWarehouseController {

    private final WarehouseService warehouseService;

    @GetMapping
    public ResponseEntity<List<WarehouseResponseDTO>> getAllWarehouses() {
        List<WarehouseResponseDTO> warehouses = warehouseService.getAllWarehouses();
        return ResponseEntity.ok(warehouses);
    }
}