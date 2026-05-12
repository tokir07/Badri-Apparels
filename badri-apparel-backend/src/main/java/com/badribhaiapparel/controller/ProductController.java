package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.ProductDTO;
import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String fabric,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.<Page<ProductDTO>>builder()
                .success(true)
                .message("Products fetched successfully")
                .data(productService.getAllProducts(search, categoryId, minPrice, maxPrice, fabric, sort, pageable))
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<ProductDTO>builder()
                .success(true)
                .message("Product fetched successfully")
                .data(productService.getProductById(id))
                .build());
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<java.util.List<ProductDTO>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.<java.util.List<ProductDTO>>builder()
                .success(true)
                .message("Featured products fetched successfully")
                .data(productService.getFeaturedProducts())
                .build());
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<java.util.List<ProductDTO>>> getTrendingProducts() {
        return ResponseEntity.ok(ApiResponse.<java.util.List<ProductDTO>>builder()
                .success(true)
                .message("Trending products fetched successfully")
                .data(productService.getTrendingProducts())
                .build());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(
            @RequestPart("product") ProductDTO productDTO,
            @RequestPart(value = "images", required = false) java.util.List<org.springframework.web.multipart.MultipartFile> images) {
        return ResponseEntity.ok(ApiResponse.<ProductDTO>builder()
                .success(true)
                .message("Product created successfully")
                .data(productService.createProduct(productDTO, images))
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(ApiResponse.<ProductDTO>builder()
                .success(true)
                .message("Product updated successfully")
                .data(productService.updateProduct(id, productDTO))
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Product deleted successfully")
                .build());
    }

    // --- Variant Management (Admin) ---

    @PostMapping("/admin/{productId}/variants")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<com.badribhaiapparel.dto.ProductVariantDto>> addVariant(
            @PathVariable Long productId,
            @RequestBody @jakarta.validation.Valid com.badribhaiapparel.dto.ProductVariantRequest req) {
        return ResponseEntity.ok(ApiResponse.<com.badribhaiapparel.dto.ProductVariantDto>builder()
                .success(true)
                .message("Variant added successfully")
                .data(productService.addVariant(productId, req))
                .build());
    }

    @PutMapping("/admin/{productId}/variants/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<com.badribhaiapparel.dto.ProductVariantDto>> updateVariant(
            @PathVariable Long productId,
            @PathVariable java.util.UUID id,
            @RequestBody @jakarta.validation.Valid com.badribhaiapparel.dto.ProductVariantRequest req) {
        return ResponseEntity.ok(ApiResponse.<com.badribhaiapparel.dto.ProductVariantDto>builder()
                .success(true)
                .message("Variant updated successfully")
                .data(productService.updateVariant(id, req))
                .build());
    }

    @DeleteMapping("/admin/{productId}/variants/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteVariant(
            @PathVariable Long productId,
            @PathVariable java.util.UUID id) {
        productService.deleteVariant(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Variant deleted successfully")
                .build());
    }

    // --- Inventory Management (Admin) ---

    @GetMapping("/admin/inventory/low-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<java.util.List<com.badribhaiapparel.dto.ProductVariantDto>>> getLowStockVariants() {
        return ResponseEntity.ok(ApiResponse.<java.util.List<com.badribhaiapparel.dto.ProductVariantDto>>builder()
                .success(true)
                .message("Low stock variants fetched successfully")
                .data(productService.getLowStockVariants())
                .build());
    }

    @PostMapping("/admin/inventory/bulk-stock-update")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<Void>> bulkUpdateStock(
            @RequestBody java.util.List<com.badribhaiapparel.dto.StockUpdateItem> items) {
        productService.bulkUpdateStock(items);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Bulk stock update successful")
                .build());
    }
}
