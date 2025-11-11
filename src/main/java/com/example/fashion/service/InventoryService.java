package com.example.fashion.service;

import com.example.fashion.dto.InventoryRequestDTO;
import com.example.fashion.dto.InventoryResponseDTO;
import com.example.fashion.entity.ProductVariant;
import com.example.fashion.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryService {

    private final ProductVariantRepository variantRepository;

    public InventoryResponseDTO.UpdateSuccess updateStock(InventoryRequestDTO request) {
        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Biến thể không tồn tại: ID = " + request.getVariantId()));

        variant.setStockQuantity(request.getQuantity());
        variantRepository.save(variant);

        return InventoryResponseDTO.UpdateSuccess.builder()
                .message("Cập nhật tồn kho thành công cho biến thể ID: " + request.getVariantId())
                .build();
    }

    @Transactional(readOnly = true)
    public List<InventoryResponseDTO.LowStockItem> getLowStock() {
        return variantRepository.findByStockQuantityLessThanEqual(10).stream()
                .map(v -> InventoryResponseDTO.LowStockItem.builder()
                        .variantId(v.getId())
                        .sku(v.getSku())
                        .currentStock(v.getStockQuantity())
                        .productName(v.getProduct() != null ? v.getProduct().getName() : "Sản phẩm không xác định")
                        .attributes(v.getAttributes())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public InventoryResponseDTO.StockInfo getStock(Long variantId) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Biến thể không tồn tại"));

        return InventoryResponseDTO.StockInfo.builder()
                .variantId(variant.getId())
                .sku(variant.getSku())
                .quantity(variant.getStockQuantity())
                .productName(variant.getProduct() != null ? variant.getProduct().getName() : "Sản phẩm không xác định")
                .build();
    }
}