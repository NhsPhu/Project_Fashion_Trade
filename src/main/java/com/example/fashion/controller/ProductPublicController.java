package com.example.fashion.controller;

import com.example.fashion.dto.CategoryTreeResponseDTO;
import com.example.fashion.dto.ProductDetailResponseDTO;
import com.example.fashion.dto.ProductFilterRequestDTO;
import com.example.fashion.dto.ProductPublicResponseDTO;
import com.example.fashion.service.CategoryTreeService;
import com.example.fashion.service.ProductCatalogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
public class ProductPublicController {

    private final ProductCatalogService productCatalogService;
    private final CategoryTreeService categoryTreeService;

    public ProductPublicController(ProductCatalogService productCatalogService,
                                   CategoryTreeService categoryTreeService) {
        this.productCatalogService = productCatalogService;
        this.categoryTreeService = categoryTreeService;
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductPublicResponseDTO>> getProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "brandId", required = false) Long brandId,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "colors", required = false) String colors,
            @RequestParam(value = "sizes", required = false) String sizes,
            @RequestParam(value = "inStock", required = false) Boolean inStock,
            @RequestParam(value = "onSale", required = false) Boolean onSale,
            @RequestParam(value = "minRating", required = false) Integer minRating,
            @RequestParam(value = "search", required = false) String search
    ) {

        Sort sortConfig = Sort.by("createdAt").descending();
        if (sort != null && !sort.isBlank()) {
            switch (sort) {
                case "newest" -> sortConfig = Sort.by("createdAt").descending();
                case "name_asc" -> sortConfig = Sort.by("name").ascending();
                case "name_desc" -> sortConfig = Sort.by("name").descending();
                default -> sortConfig = Sort.by("createdAt").descending();
            }
        }

        Pageable pageable = PageRequest.of(page, size, sortConfig);

        ProductFilterRequestDTO filter = new ProductFilterRequestDTO();
        filter.setCategoryId(categoryId);
        filter.setBrandId(brandId);
        filter.setMinPrice(minPrice);
        filter.setMaxPrice(maxPrice);
        filter.setInStock(inStock);
        filter.setOnSale(onSale);
        filter.setMinRating(minRating);
        filter.setSearch(search);
        if (colors != null && !colors.isBlank()) {
            filter.setColors(Arrays.asList(colors.split(",")));
        }
        if (sizes != null && !sizes.isBlank()) {
            filter.setSizes(Arrays.asList(sizes.split(",")));
        }

        return ResponseEntity.ok(productCatalogService.searchProducts(filter, pageable));
    }

    @GetMapping("/products/slug/{slug}")
    public ResponseEntity<ProductDetailResponseDTO> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productCatalogService.getProductDetailBySlug(slug));
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductDetailResponseDTO> getProductById(@PathVariable Long productId) {
        return ResponseEntity.ok(productCatalogService.getProductDetail(productId));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryTreeResponseDTO>> getCategories() {
        return ResponseEntity.ok(categoryTreeService.getRootCategories());
    }
}
