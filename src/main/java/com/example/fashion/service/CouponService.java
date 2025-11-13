// src/main/java/com/example/fashion/service/CouponService.java
package com.example.fashion.service;

import com.example.fashion.dto.CouponRequestDTO;
import com.example.fashion.dto.CouponResponseDTO;
import com.example.fashion.entity.Coupon;
import com.example.fashion.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponResponseDTO.Success createCoupon(CouponRequestDTO request) {
        if (couponRepository.findByCodeIgnoreCase(request.getCode().trim()).isPresent()) {
            throw new IllegalArgumentException("Mã coupon đã tồn tại: " + request.getCode());
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode().trim().toUpperCase())
                .type(request.getType())
                .value(request.getValue()) // BigDecimal
                .minOrderValue(request.getMinOrderValue()) // BigDecimal
                .productIds(request.getProductIds())
                .categoryIds(request.getCategoryIds())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .active(true)
                .build();

        couponRepository.save(coupon);

        return CouponResponseDTO.Success.builder()
                .message("Tạo mã giảm giá thành công: " + coupon.getCode())
                .build();
    }

    public CouponResponseDTO.Success updateCoupon(Long id, CouponRequestDTO request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon không tồn tại: ID = " + id));

        if (!coupon.getCode().equalsIgnoreCase(request.getCode().trim()) &&
                couponRepository.findByCodeIgnoreCase(request.getCode().trim()).isPresent()) {
            throw new IllegalArgumentException("Mã coupon đã tồn tại: " + request.getCode());
        }

        coupon.setCode(request.getCode().trim().toUpperCase());
        coupon.setType(request.getType());
        coupon.setValue(request.getValue()); // BigDecimal
        coupon.setMinOrderValue(request.getMinOrderValue()); // BigDecimal
        coupon.setProductIds(request.getProductIds());
        coupon.setCategoryIds(request.getCategoryIds());
        coupon.setStartDate(request.getStartDate());
        coupon.setEndDate(request.getEndDate());
        coupon.setUsageLimit(request.getUsageLimit());

        couponRepository.save(coupon);

        return CouponResponseDTO.Success.builder()
                .message("Cập nhật mã giảm giá thành công: " + coupon.getCode())
                .build();
    }

    public CouponResponseDTO.Success deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon không tồn tại: ID = " + id));
        coupon.setActive(false);
        couponRepository.save(coupon);

        return CouponResponseDTO.Success.builder()
                .message("Xóa mã giảm giá thành công: " + coupon.getCode())
                .build();
    }

    @Transactional(readOnly = true)
    public List<CouponResponseDTO> getAllCoupons() {
        return couponRepository.findByActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CouponResponseDTO getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon không tồn tại: ID = " + id));
        return mapToDTO(coupon);
    }

    private CouponResponseDTO mapToDTO(Coupon coupon) {
        return CouponResponseDTO.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .type(coupon.getType())
                .value(coupon.getValue()) // BigDecimal
                .minOrderValue(coupon.getMinOrderValue()) // BigDecimal
                .productIds(coupon.getProductIds())
                .categoryIds(coupon.getCategoryIds())
                .startDate(coupon.getStartDate())
                .endDate(coupon.getEndDate())
                .usageLimit(coupon.getUsageLimit())
                .usedCount(coupon.getUsedCount())
                .active(coupon.getActive())
                .build();
    }
}