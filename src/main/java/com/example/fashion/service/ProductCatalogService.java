// src/main/java/com/example/fashion/service/ProductCatalogService.java
package com.example.fashion.service;

import com.example.fashion.dto.ProductDetailResponseDTO;
import com.example.fashion.dto.ProductFilterRequestDTO;
import com.example.fashion.dto.ProductPublicResponseDTO;
import com.example.fashion.entity.Product;
import com.example.fashion.entity.Review;
import com.example.fashion.repository.ProductRepository;
import com.example.fashion.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ProductCatalogService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    // DÙNG ProductRepository (có JpaSpecificationExecutor) → KHÔNG CẦN ProductSpecificationRepository
    // → Không tạo thêm repository

    /**
     * Lấy chi tiết sản phẩm theo ID
     */
    @Transactional(readOnly = true)
    public ProductDetailResponseDTO getProductDetail(Long id) {
        Product product = productRepository.findByIdWithAllDetails(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        Set<Review> reviews = reviewRepository.findByProductId(id);

        return ProductDetailResponseDTO.from(product, reviews);
    }

    /**
     * Lấy chi tiết sản phẩm theo slug
     */
    @Transactional(readOnly = true)
    public ProductDetailResponseDTO getProductDetailBySlug(String slug) {
        Product product = productRepository.findBySlugWithAllDetails(slug)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        Set<Review> reviews = reviewRepository.findByProductId(product.getId());

        return ProductDetailResponseDTO.from(product, reviews);
    }

    /**
     * Tìm kiếm + lọc sản phẩm (DÙNG ProductRepository + Specification)
     * → Không tạo thêm repository, không tạo folder mới
     */
    @Transactional(readOnly = true)
    public Page<ProductPublicResponseDTO> searchProducts(ProductFilterRequestDTO filter, Pageable pageable) {

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Tìm kiếm theo tên
            if (filter.getSearch() != null && !filter.getSearch().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")),
                        "%" + filter.getSearch().trim().toLowerCase() + "%"));
            }

            // Lọc theo danh mục
            if (filter.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.getCategoryId()));
            }

            // Lọc theo thương hiệu
            if (filter.getBrandId() != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), filter.getBrandId()));
            }

            // Lọc theo giá
            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("basePrice"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("basePrice"), filter.getMaxPrice()));
            }

            // Còn hàng
            if (filter.getInStock() != null && filter.getInStock()) {
                predicates.add(cb.greaterThan(root.get("stockQuantity"), 0));
            }

            // Đang giảm giá
            if (filter.getOnSale() != null && filter.getOnSale()) {
                predicates.add(cb.isNotNull(root.get("salePrice")));
            }

            // Đánh giá tối thiểu
            if (filter.getMinRating() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("averageRating"), filter.getMinRating()));
            }

            // Lọc theo màu sắc (join variants)
            if (filter.getColors() != null && !filter.getColors().isEmpty()) {
                Join<Product, Object> variants = root.join("variants");
                predicates.add(variants.get("color").in(filter.getColors()));
            }

            // Lọc theo kích thước (join variants)
            if (filter.getSizes() != null && !filter.getSizes().isEmpty()) {
                Join<Product, Object> variants = root.join("variants");
                predicates.add(variants.get("size").in(filter.getSizes()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Dùng ProductRepository (đã extends JpaSpecificationExecutor)
        Page<Product> productPage = productRepository.findAll(spec, pageable);

        return productPage.map(ProductPublicResponseDTO::fromProduct);
    }
}