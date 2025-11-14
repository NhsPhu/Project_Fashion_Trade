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

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository productVariantRepository;

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

        product = productRepository.save(product);
        return ProductResponseDTO.fromProduct(product);
    }

    // UPDATE
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

        productVariantRepository.deleteAll(product.getVariants());
        List<ProductVariant> variants = mapVariantDTOsToEntities(product, request.getVariants());
        product.setVariants(variants);

        product = productRepository.save(product);
        return ProductResponseDTO.fromProduct(product);
    }

    // DELETE
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }

    // GET ALL - SỬA: Sử dụng query load variants
    public Page<ProductResponseDTO> getAllProducts(Pageable pageable) {
        return productRepository.findAllWithVariants(pageable)
                .map(ProductResponseDTO::fromProduct);
    }

    // GET BY ID
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ProductResponseDTO.fromProduct(product);
    }

    // PRIVATE: MAP THÔNG TIN CƠ BẢN
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
            }
        }
        return variants;
    }
}