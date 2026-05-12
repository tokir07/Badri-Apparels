package com.badribhaiapparel.service;

import com.badribhaiapparel.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ProductService {
    ProductDTO createProduct(ProductDTO productDTO, List<MultipartFile> images);
    ProductDTO updateProduct(Long id, ProductDTO productDTO);
    void deleteProduct(Long id);
    ProductDTO getProductById(Long id);
    ProductDTO getProductBySlug(String slug);
    Page<ProductDTO> getAllProducts(
      String search, 
      Long categoryId, 
      java.math.BigDecimal minPrice, 
      java.math.BigDecimal maxPrice, 
      String fabric, 
      String sort, 
      Pageable pageable
    );
    java.util.List<ProductDTO> getFeaturedProducts();
    java.util.List<ProductDTO> getTrendingProducts();

    // Variant Management
    com.badribhaiapparel.dto.ProductVariantDto addVariant(Long productId, com.badribhaiapparel.dto.ProductVariantRequest req);
    com.badribhaiapparel.dto.ProductVariantDto updateVariant(java.util.UUID variantId, com.badribhaiapparel.dto.ProductVariantRequest req);
    void deleteVariant(java.util.UUID variantId);
    
    // Inventory Management
    java.util.List<com.badribhaiapparel.dto.ProductVariantDto> getLowStockVariants();
    void bulkUpdateStock(java.util.List<com.badribhaiapparel.dto.StockUpdateItem> items);
}
