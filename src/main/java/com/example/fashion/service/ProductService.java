package com.example.fashion.service;

import com.example.fashion.dto.*;
import com.example.fashion.entity.*;
import com.example.fashion.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    // Không cần 2 repository con ở đây nữa vì ta sẽ dùng Cascade của JPA

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    /**
     * CHỨC NĂNG TẠO (CREATE) - Giữ nguyên
     */
    @Transactional
    public ProductResponseDTO createProduct(ProductCreateRequestDTO request) {
        // ... (Logic tìm Category/Brand giữ nguyên)
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Category ID: " + request.getCategoryId()));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Brand ID: " + request.getBrandId()));

        Product product = new Product();
        this.mapRequestToProduct(product, request.getName(), request.getSlug(), request.getDescription(),
                request.getStatus(), request.getDefaultImage(), category, brand,
                request.getSeoMetaTitle(), request.getSeoMetaDesc());

        // Map variants mới
        if (request.getVariants() != null) {
            Set<ProductVariant> variants = new HashSet<>();
            for (ProductVariantRequestDTO dto : request.getVariants()) {
                ProductVariant v = new ProductVariant();
                mapDtoToVariant(v, dto); // Hàm helper mới
                v.setProduct(product);
                variants.add(v);
            }
            product.setVariants(variants);
        }

        // Map images mới
        if (request.getImages() != null) {
            Set<ProductImage> images = new HashSet<>();
            for (ProductImageRequestDTO dto : request.getImages()) {
                ProductImage i = new ProductImage();
                i.setUrl(dto.getUrl());
                i.setAltText(dto.getAltText());
                i.setProduct(product);
                images.add(i);
            }
            product.setImages(images);
        }

        return ProductResponseDTO.fromProduct(productRepository.save(product));
    }

    /**
     * CHỨC NĂNG CẬP NHẬT (UPDATE) - ĐÃ SỬA LOGIC
     */
    @Transactional
    public ProductResponseDTO updateProduct(Long productId, ProductUpdateRequestDTO request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Product ID: " + productId));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Category ID: " + request.getCategoryId()));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Brand ID: " + request.getBrandId()));

        // 1. Cập nhật thông tin chung
        this.mapRequestToProduct(product, request.getName(), request.getSlug(), request.getDescription(),
                request.getStatus(), request.getDefaultImage(), category, brand,
                request.getSeoMetaTitle(), request.getSeoMetaDesc());

        // 2. CẬP NHẬT VARIANTS (Thông minh: Update cái cũ, Thêm cái mới, Xóa cái thừa)
        updateVariants(product, request.getVariants());

        // 3. CẬP NHẬT IMAGES (Logic tương tự: Xóa hết set lại cho nhanh vì Image ít ràng buộc)
        // Với Image thì xóa đi tạo lại ít rủi ro hơn Variant (vì Variant dính tới đơn hàng/kho)
        if (request.getImages() != null) {
            product.getImages().clear(); // Xóa list cũ (Hibernate orphanRemoval sẽ xóa DB)
            for (ProductImageRequestDTO imgDto : request.getImages()) {
                ProductImage img = new ProductImage();
                img.setUrl(imgDto.getUrl());
                img.setAltText(imgDto.getAltText());
                img.setProduct(product);
                product.getImages().add(img);
            }
        }

        return ProductResponseDTO.fromProduct(productRepository.save(product));
    }

    // =================================================================
    // LOGIC CỐT LÕI ĐỂ SỬA LỖI DUPLICATE ENTRY
    // =================================================================
    private void updateVariants(Product product, Set<ProductVariantRequestDTO> newVariantDtos) {
        if (newVariantDtos == null) return;

        // Tạo Map từ danh sách variant HIỆN CÓ trong DB (Key là SKU)
        Map<String, ProductVariant> existingVariantsMap = product.getVariants().stream()
                .collect(Collectors.toMap(ProductVariant::getSku, Function.identity()));

        Set<ProductVariant> updatedVariants = new HashSet<>();

        for (ProductVariantRequestDTO dto : newVariantDtos) {
            // Kiểm tra xem SKU này đã có chưa
            ProductVariant variant = existingVariantsMap.get(dto.getSku());

            if (variant != null) {
                // TRƯỜNG HỢP 1: Đã có -> Cập nhật thông tin (Giữ nguyên ID)
                mapDtoToVariant(variant, dto);
                updatedVariants.add(variant);
                // Xóa khỏi map để lát nữa biết cái nào thừa
                existingVariantsMap.remove(dto.getSku());
            } else {
                // TRƯỜNG HỢP 2: Chưa có -> Tạo mới (INSERT)
                ProductVariant newVariant = new ProductVariant();
                mapDtoToVariant(newVariant, dto);
                newVariant.setProduct(product);
                updatedVariants.add(newVariant);
            }
        }

        // Bước này quan trọng: Thay thế set cũ bằng set mới đã xử lý
        // Hibernate sẽ tự động:
        // - Update những cái cũ được sửa
        // - Insert những cái mới thêm
        // - Delete những cái cũ không còn trong danh sách (những cái còn lại trong existingVariantsMap)
        product.getVariants().clear();
        product.getVariants().addAll(updatedVariants);
    }

    // Hàm helper map dữ liệu variant
    private void mapDtoToVariant(ProductVariant v, ProductVariantRequestDTO dto) {
        v.setSku(dto.getSku());
        v.setPrice(dto.getPrice());
        v.setSalePrice(dto.getSalePrice());
        v.setStockQuantity(dto.getStockQuantity());
        v.setWeight(dto.getWeight());
        v.setAttributes(dto.getAttributes());
    }

    // =================================================================
    // CÁC HÀM KHÁC GIỮ NGUYÊN
    // =================================================================
    public Page<ProductResponseDTO> getAllProducts(Pageable pageable) {
        return productRepository.findAllWithVariants(pageable).map(ProductResponseDTO::fromProduct);
    }

    public ProductResponseDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ProductResponseDTO.fromProduct(product);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow();
        product.setStatus("Archived");
        productRepository.save(product);
    }

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
}