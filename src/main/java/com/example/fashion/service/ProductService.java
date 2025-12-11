// src/main/java/com/example/fashion/service/ProductService.java
package com.example.fashion.service;

import com.example.fashion.dto.*;
import com.example.fashion.entity.*;
import com.example.fashion.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          BrandRepository brandRepository,
                          ProductVariantRepository productVariantRepository,
                          ProductImageRepository productImageRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productVariantRepository = productVariantRepository;
        this.productImageRepository = productImageRepository;
    }

    /**
     * CHỨC NĂNG TẠO (CREATE)
     */
    @Transactional
    public ProductResponseDTO createProduct(ProductCreateRequestDTO request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Category ID: " + request.getCategoryId()));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Brand ID: " + request.getBrandId()));

        Product product = new Product();
        // (Sao chép các trường từ request sang product)
        this.mapRequestToProduct(product, request.getName(), request.getSlug(), request.getDescription(),
                request.getStatus(), request.getDefaultImage(), category, brand,
                request.getSeoMetaTitle(), request.getSeoMetaDesc());

        // Xử lý Variants
        Set<ProductVariant> variants = this.mapVariantDTOsToEntities(product, request.getVariants());
        product.setVariants(variants);

        // Xử lý Images
        Set<ProductImage> images = this.mapImageDTOsToEntities(product, request.getImages());
        product.setImages(images);

        Product savedProduct = productRepository.save(product);
        return ProductResponseDTO.fromProduct(savedProduct);
    }

    /**
     * CHỨC NĂNG ĐỌC (READ) - LẤY DANH SÁCH + PHÂN TRANG
     */
    public Page<ProductResponseDTO> getAllProducts(Pageable pageable) {

        // SỬA LỖI N+1:
        // Page<Product> productPage = productRepository.findAll(pageable); // <-- Lỗi cũ
        Page<Product> productPage = productRepository.findAllWithVariants(pageable); // <-- ĐÃ SỬA

        // 2. Chuyển đổi (map) trang Entity sang trang DTO
        return productPage.map(ProductResponseDTO::fromProduct);
    }

    /**
     * CHỨC NĂNG ĐỌC (READ) - LẤY MỘT SẢN PHẨM
     */
    public ProductResponseDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Product ID: " + productId));
        return ProductResponseDTO.fromProduct(product);
    }

    /**
     * CHỨC NĂNG CẬP NHẬT (UPDATE)
     */
    @Transactional
    public ProductResponseDTO updateProduct(Long productId, ProductUpdateRequestDTO request) {
        // 1. Tìm sản phẩm
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Product ID: " + productId));

        // 2. Tìm Category và Brand
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Category ID: " + request.getCategoryId()));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Brand ID: " + request.getBrandId()));

        // 3. Cập nhật thông tin cơ bản
        this.mapRequestToProduct(product, request.getName(), request.getSlug(), request.getDescription(),
                request.getStatus(), request.getDefaultImage(), category, brand,
                request.getSeoMetaTitle(), request.getSeoMetaDesc());

        // 4. Cập nhật Variants và Images (Cách đơn giản: Xóa cũ, thêm mới)
        product.getVariants().clear();
        product.getImages().clear();
        productVariantRepository.deleteAll(product.getVariants());
        productImageRepository.deleteAll(product.getImages());

        Set<ProductVariant> newVariants = this.mapVariantDTOsToEntities(product, request.getVariants());
        product.getVariants().addAll(newVariants);

        Set<ProductImage> newImages = this.mapImageDTOsToEntities(product, request.getImages());
        product.getImages().addAll(newImages);

        // 5. Lưu lại
        Product updatedProduct = productRepository.save(product);
        return ProductResponseDTO.fromProduct(updatedProduct);
    }

    /**
     * CHỨC NĂNG XÓA (DELETE) - Soft Delete
     */
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Product ID: " + productId));

        product.setStatus("Archived");
        productRepository.save(product);
    }


    // =================================================================
    // CÁC HÀM TIỆN ÍCH (PRIVATE HELPERS)
    // =================================================================

    private void mapRequestToProduct(Product product, String name, String slug, String desc,
                                     String status, String defaultImage, Category category,
                                     Brand brand, String seoTitle, String seoDesc) {
        product.setName(name);
        product.setSlug(slug);
        product.setDescription(desc);
        product.setStatus(status);
        product.setDefaultImage(defaultImage);
        product.setCategory(category);
        product.setBrand(brand);
        product.setSeoMetaTitle(seoTitle);
        product.setSeoMetaDesc(seoDesc);
    }

    private Set<ProductVariant> mapVariantDTOsToEntities(Product product, Set<ProductVariantRequestDTO> variantDTOs) {
        Set<ProductVariant> variants = new HashSet<>();
        if (variantDTOs != null) {
            for (ProductVariantRequestDTO variantDTO : variantDTOs) {
                ProductVariant variant = new ProductVariant();
                variant.setSku(variantDTO.getSku());
                variant.setAttributes(variantDTO.getAttributes());
                variant.setPrice(variantDTO.getPrice());
                variant.setSalePrice(variantDTO.getSalePrice());
                variant.setStockQuantity(variantDTO.getStockQuantity());
                variant.setWeight(variantDTO.getWeight());
                variant.setProduct(product); // Liên kết lại
                variants.add(variant);
            }
        }
        return variants;
    }

    private Set<ProductImage> mapImageDTOsToEntities(Product product, Set<ProductImageRequestDTO> imageDTOs) {
        Set<ProductImage> images = new HashSet<>();
        if (imageDTOs != null) {
            for (ProductImageRequestDTO imageDTO : imageDTOs) {
                ProductImage image = new ProductImage();
                image.setUrl(imageDTO.getUrl());
                image.setAltText(imageDTO.getAltText());
                image.setOrder(imageDTO.getOrder());
                image.setProduct(product); // Liên kết lại
                images.add(image);
            }
        }
        return images;
    }
}