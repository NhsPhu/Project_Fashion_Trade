// src/main/java/com/example/fashion/service/CouponService.java

package com.example.fashion.service;

import com.example.fashion.dto.CouponRequestDTO;
import com.example.fashion.dto.CouponResponseDTO;
import com.example.fashion.entity.Coupon;
import com.example.fashion.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponService {

    private final CouponRepository couponRepository;

    // Tạo mã mới
    public CouponResponseDTO.Success createCoupon(CouponRequestDTO request) {
        if (couponRepository.findByCodeIgnoreCase(request.getCode().trim()).isPresent()) {
            throw new IllegalArgumentException("Mã coupon đã tồn tại: " + request.getCode());
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode().trim().toUpperCase())
                .type(request.getType())
                .value(request.getValue())
                .minOrderValue(request.getMinOrderValue())
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

    // Cập nhật mã
    public CouponResponseDTO.Success updateCoupon(Long id, CouponRequestDTO request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon không tồn tại: ID = " + id));

        if (!coupon.getCode().equalsIgnoreCase(request.getCode().trim()) &&
                couponRepository.findByCodeIgnoreCase(request.getCode().trim()).isPresent()) {
            throw new IllegalArgumentException("Mã coupon đã tồn tại: " + request.getCode());
        }

        coupon.setCode(request.getCode().trim().toUpperCase());
        coupon.setType(request.getType());
        coupon.setValue(request.getValue());
        coupon.setMinOrderValue(request.getMinOrderValue());
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

    // Xóa mềm (chỉ tắt active)
    public CouponResponseDTO.Success deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon không tồn tại: ID = " + id));
        coupon.setActive(false);
        couponRepository.save(coupon);

        return CouponResponseDTO.Success.builder()
                .message("Xóa mã giảm giá thành công: " + coupon.getCode())
                .build();
    }

    // LẤY DANH SÁCH MÃ - TỰ ĐỘNG KIỂM TRA HẾT HẠN
    @Transactional(readOnly = true)
    public List<CouponResponseDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // LẤY CHI TIẾT 1 MÃ - TỰ ĐỘNG KIỂM TRA HẾT HẠN
    @Transactional(readOnly = true)
    public CouponResponseDTO getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon không tồn tại: ID = " + id));
        return mapToDTO(coupon);
    }

    // HÀM CHUYỂN ĐỔI ENTITY → DTO (CÓ TỰ ĐỘNG TẮT KHI HẾT HẠN)
    private CouponResponseDTO mapToDTO(Coupon coupon) {
        LocalDateTime now = LocalDateTime.now();

        // Kiểm tra mã có còn hiệu lực không
        boolean isActive = coupon.getActive()
                && (coupon.getStartDate() == null || !coupon.getStartDate().isAfter(now))  // Chưa tới ngày bắt đầu thì chưa active
                && (coupon.getEndDate() == null || coupon.getEndDate().isAfter(now));   // Đã qua ngày kết thúc → tự tắt

        return CouponResponseDTO.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .type(coupon.getType())
                .value(coupon.getValue())
                .minOrderValue(coupon.getMinOrderValue())
                .productIds(coupon.getProductIds())
                .categoryIds(coupon.getCategoryIds())
                .startDate(coupon.getStartDate())
                .endDate(coupon.getEndDate())
                .usageLimit(coupon.getUsageLimit())
                .usedCount(coupon.getUsedCount())
                .active(isActive)  // ← TỰ ĐỘNG TẮT KHI HẾT HẠN HOẶC CHƯA TỚI NGÀY
                .build();
    }
}