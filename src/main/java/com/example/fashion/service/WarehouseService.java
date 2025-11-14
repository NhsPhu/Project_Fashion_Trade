package com.example.fashion.service;

import com.example.fashion.dto.WarehouseResponseDTO;
import com.example.fashion.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public List<WarehouseResponseDTO> getAllWarehouses() {
        return warehouseRepository.findAll().stream()
                .map(wh -> WarehouseResponseDTO.builder()
                        .id(wh.getId())
                        .name(wh.getName())
                        .location(wh.getLocation())
                        .build())
                .toList();
    }
}