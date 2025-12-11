// src/main/java/com/example/fashion/entity/ReviewStatus.java
package com.example.fashion.enums;

/**
 * Trạng thái của một đánh giá (Review)
 * <p>
 * - PENDING: Chờ duyệt (mặc định)<br>
 * - APPROVED: Đã duyệt, hiển thị công khai<br>
 * - REJECTED: Bị từ chối, không hiển thị
 * </p>
 */
public enum ReviewStatus {
    PENDING,
    APPROVED,
    REJECTED
}