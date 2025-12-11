// src/main/java/com/example/fashion/service/ProductService.java
package com.example.fashion.service;

import com.example.fashion.dto.*;
import com.example.fashion.entity.*;
import com.example.fashion.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map; // <-- IMPORT MỚI
import java.util.stream.Collectors; // <-- IMPORT MỚI

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository productVariantRepository;
    // (Chúng ta có thể cần OrderItemRepository để kiểm tra, nhưng sẽ cố gắng tránh)

    // CREATE
    @Transactional
    public ProductResponseDTO createProduct(ProductCreateRequestDTO request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        Product product = new Product();
        mapRequestToProduct(product, request.getName(), request.getSlug(), request.getDescription(),
                request.getStatus(), request.getDefaultImage(), category, brand,
                request.getSeoMetaTitle(), request.getSeoMetaDesc());

        List<ProductVariant> variants = mapVariantDTOsToEntities(product, request.getVariants());
        product.setVariants(variants);

<<<<<<< HEAD
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
=======
        product = productRepository.save(product);
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
        return ProductResponseDTO.fromProduct(product);
    }

    // ========== SỬA LỖI UPDATE (image_1a3fdf.png) ==========
    @Transactional
    public ProductResponseDTO updateProduct(Long id, ProductUpdateRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        mapRequestToProduct(product, request.getName(), request.getSlug(), request.getDescription(),
                request.getStatus(), request.getDefaultImage(), category, brand,
                request.getSeoMetaTitle(), request.getSeoMetaDesc());

<<<<<<< HEAD
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
=======
        // Logic cập nhật Variant an toàn (Update/Add)
        // 1. Lấy Map các variants hiện tại (key = SKU)
        Map<String, ProductVariant> existingVariantsMap = product.getVariants().stream()
                .filter(v -> v.getSku() != null)
                .collect(Collectors.toMap(ProductVariant::getSku, v -> v, (v1, v2) -> v1));

        // 2. Tạo List mới cho các variants sẽ được LƯU
        List<ProductVariant> finalVariants = new ArrayList<>();

        if (request.getVariants() != null) {
            for (var dto : request.getVariants()) {
                ProductVariant variant;
                if (dto.getSku() != null && existingVariantsMap.containsKey(dto.getSku())) {
                    // 2a. Nếu SKU đã tồn tại -> Cập nhật (Update)
                    variant = existingVariantsMap.get(dto.getSku());
                    // Xóa nó khỏi map (để lát nữa xác định các variant cần xóa)
                    existingVariantsMap.remove(dto.getSku());
                } else {
                    // 2b. Nếu SKU mới -> Tạo mới (Create)
                    variant = new ProductVariant();
                    variant.setProduct(product); // Liên kết
                }
                // Cập nhật thông tin từ DTO
                variant.setSku(dto.getSku());
                variant.setAttributes(dto.getAttributes());
                variant.setPrice(dto.getPrice());
                variant.setSalePrice(dto.getSalePrice());
                variant.setStockQuantity(dto.getStockQuantity());
                variant.setWeight(dto.getWeight());

                finalVariants.add(variant); // Thêm variant (mới hoặc đã cập nhật) vào List cuối cùng
            }
        }

        // 3. Xóa các variant cũ (KHÔNG CÓ trong request mới)
        //    Lưu ý: Nếu các variant này đã có trong 'order_items', chúng ta
        //    KHÔNG THỂ XÓA CỨNG. Chúng ta nên đặt chúng thành "inactive" (ẩn).
        //    Tuy nhiên, để fix lỗi hiện tại, chúng ta sẽ thử xóa chúng.
        try {
            productVariantRepository.deleteAll(existingVariantsMap.values());
        } catch (Exception e) {
            // (Nếu không xóa được do Ràng buộc Khóa ngoại)
            throw new RuntimeException("Không thể xóa biến thể cũ (đã có trong đơn hàng). Hãy sửa thay vì xóa.");
        }

        // 4. Gán lại list cuối cùng cho product
        product.getVariants().clear();
        product.getVariants().addAll(finalVariants);

        product = productRepository.save(product);
        return ProductResponseDTO.fromProduct(product);
    }

    // ========== SỬA LỖI DELETE (Dùng Soft Delete) ==========
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

<<<<<<< HEAD
=======
        // (Theo yêu cầu Mục 4.2: Quản lý trạng thái: Draft / Published / Archived)
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
        product.setStatus("Archived");
        productRepository.save(product);
    }
    // ===================================

    // GET ALL - SỬA: Sử dụng query load variants
    public Page<ProductResponseDTO> getAllProducts(Pageable pageable) {
        // (Lưu ý: hàm 'findAllWithVariants' cần được định nghĩa trong ProductRepository)
        // Nếu bạn chưa định nghĩa, hãy dùng 'findAll'
        return productRepository.findAll(pageable)
                .map(ProductResponseDTO::fromProduct);
    }

    // GET BY ID
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ProductResponseDTO.fromProduct(product);
    }

<<<<<<< HEAD
=======
    // PRIVATE: MAP THÔNG TIN CƠ BẢN
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
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

<<<<<<< HEAD
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
=======
    // PRIVATE: CHUYỂN DTO → ENTITY (VARIANT)
    private List<ProductVariant> mapVariantDTOsToEntities(
            Product product,
            List<ProductCreateRequestDTO.ProductVariantRequestDTO> dtos) {

        List<ProductVariant> variants = new ArrayList<>();
        if (dtos != null) {
            for (var dto : dtos) {
                ProductVariant v = new ProductVariant();
                v.setSku(dto.getSku());
                v.setAttributes(dto.getAttributes());
                v.setPrice(dto.getPrice());
                v.setSalePrice(dto.getSalePrice());
                v.setStockQuantity(dto.getStockQuantity());
                v.setWeight(dto.getWeight());
                v.setProduct(product);
                variants.add(v);
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
            }
        }
        return variants;
    }
<<<<<<< HEAD

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
=======
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
}