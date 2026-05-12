package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.dto.ProductDTO;
import com.badribhaiapparel.entity.Product;
import com.badribhaiapparel.mapper.ProductMapper;
import com.badribhaiapparel.repository.CategoryRepository;
import com.badribhaiapparel.repository.ProductRepository;
import com.badribhaiapparel.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.badribhaiapparel.service.CloudinaryService;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final com.badribhaiapparel.repository.ProductVariantRepository variantRepository;
    private final ProductMapper productMapper;
    private final CloudinaryService cloudinaryService;

    public ProductServiceImpl(ProductRepository productRepository, 
                              CategoryRepository categoryRepository, 
                              com.badribhaiapparel.repository.ProductVariantRepository variantRepository,
                              ProductMapper productMapper,
                              CloudinaryService cloudinaryService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.variantRepository = variantRepository;
        this.productMapper = productMapper;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO, List<MultipartFile> images) {
        Product product = productMapper.toEntity(productDTO);
        
        // Handle Image Uploads (Raw files - legacy)
        if (images != null && !images.isEmpty()) {
            try {
                for (MultipartFile file : images) {
                    com.badribhaiapparel.dto.UploadResultDto result = cloudinaryService.uploadImage(file, "products");
                    com.badribhaiapparel.entity.ProductImage img = new com.badribhaiapparel.entity.ProductImage();
                    img.setProduct(product);
                    img.setUrl(result.getSecureUrl());
                    img.setPublicId(result.getPublicId());
                    img.setMain(product.getImages().isEmpty());
                    product.getImages().add(img);
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload product images", e);
            }
        }

        // Handle Image Metadata (Pre-uploaded)
        if (productDTO.getImages() != null && !productDTO.getImages().isEmpty()) {
            for (com.badribhaiapparel.dto.ProductImageDto imgDto : productDTO.getImages()) {
                com.badribhaiapparel.entity.ProductImage img = new com.badribhaiapparel.entity.ProductImage();
                img.setProduct(product);
                img.setUrl(imgDto.getUrl());
                img.setPublicId(imgDto.getPublicId());
                img.setMain(imgDto.isMain());
                product.getImages().add(img);
            }
        }

        if (productDTO.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found")));
        }
        
        // Default variant for legacy support if no variants provided
        if (!product.isHasVariants()) {
            product.setHasVariants(true);
            com.badribhaiapparel.entity.ProductVariant defaultVariant = new com.badribhaiapparel.entity.ProductVariant();
            defaultVariant.setProduct(product);
            defaultVariant.setSku("BB-" + product.getTitle().substring(0, Math.min(3, product.getTitle().length())).toUpperCase() + "-" + System.currentTimeMillis());
            defaultVariant.setPrice(java.math.BigDecimal.valueOf(product.getPrice()));
            defaultVariant.setMrp(java.math.BigDecimal.valueOf(product.getPrice()));
            defaultVariant.setStock(product.getStock());
            defaultVariant.setSize("Free Size");
            defaultVariant.setColor("Default");
            product.getVariants().add(defaultVariant);
        }

        return productMapper.toDto(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setTitle(productDTO.getTitle());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setDiscountPrice(productDTO.getDiscountPrice());
        product.setStock(productDTO.getStock());
        product.setSizes(productDTO.getSizes());
        product.setColors(productDTO.getColors());
        product.setBrand(productDTO.getBrand());
        product.setType(productDTO.getType());
        product.setCollection(productDTO.getCollection());
        product.setFabric(productDTO.getFabric());
        product.setPrintType(productDTO.getPrintType());
        product.setOccasion(productDTO.getOccasion());
        product.setFeatured(productDTO.isFeatured());
        product.setTrending(productDTO.isTrending());
        
        product.setHasVariants(productDTO.isHasVariants());
        product.setMetaTitle(productDTO.getTitle()); // Default to title
        product.setActive(true);

        if (productDTO.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found")));
        }

        return productMapper.toDto(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setDeletedAt(java.time.LocalDateTime.now());
        productRepository.save(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(productMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .map(productMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDTO> getAllProducts(
            String search, 
            Long categoryId, 
            java.math.BigDecimal minPrice, 
            java.math.BigDecimal maxPrice, 
            String fabric, 
            String sort, 
            Pageable pageable) {
        return productRepository.searchProducts(search, categoryId, minPrice, maxPrice, fabric, sort, pageable)
                .map(productMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream()
                .map(productMapper::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getTrendingProducts() {
        return productRepository.findByTrendingTrue().stream()
                .map(productMapper::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional
    public com.badribhaiapparel.dto.ProductVariantDto addVariant(Long productId, com.badribhaiapparel.dto.ProductVariantRequest req) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        com.badribhaiapparel.entity.ProductVariant variant = new com.badribhaiapparel.entity.ProductVariant();
        variant.setProduct(product);
        variant.setSku(req.sku() != null && !req.sku().isBlank() ? req.sku() : 
                      "BB-" + product.getTitle().substring(0,3).toUpperCase() + "-" + req.color().substring(0,2).toUpperCase() + "-" + req.size());
        variant.setSize(req.size());
        variant.setColor(req.color());
        variant.setColorHex(req.colorHex());
        variant.setMrp(req.mrp());
        variant.setPrice(req.price());
        variant.setCostPrice(req.costPrice());
        variant.setStock(req.stock());
        variant.setLowStockThreshold(req.lowStockThreshold());
        
        return productMapper.toVariantDto(variantRepository.save(variant));
    }

    @Override
    @Transactional
    public com.badribhaiapparel.dto.ProductVariantDto updateVariant(java.util.UUID variantId, com.badribhaiapparel.dto.ProductVariantRequest req) {
        com.badribhaiapparel.entity.ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));
        
        variant.setSku(req.sku());
        variant.setSize(req.size());
        variant.setColor(req.color());
        variant.setColorHex(req.colorHex());
        variant.setMrp(req.mrp());
        variant.setPrice(req.price());
        variant.setCostPrice(req.costPrice());
        variant.setStock(req.stock());
        variant.setLowStockThreshold(req.lowStockThreshold());
        
        return productMapper.toVariantDto(variantRepository.save(variant));
    }

    @Override
    @Transactional
    public void deleteVariant(java.util.UUID variantId) {
        com.badribhaiapparel.entity.ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));
        variant.setDeletedAt(java.time.LocalDateTime.now());
        variantRepository.save(variant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.badribhaiapparel.dto.ProductVariantDto> getLowStockVariants() {
        return variantRepository.findLowStockVariants().stream()
                .map(productMapper::toVariantDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional
    public void bulkUpdateStock(List<com.badribhaiapparel.dto.StockUpdateItem> items) {
        for (com.badribhaiapparel.dto.StockUpdateItem item : items) {
            com.badribhaiapparel.entity.ProductVariant variant = variantRepository.findById(item.variantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found: " + item.variantId()));
            variant.setStock(variant.getStock() + item.quantityChange());
            variantRepository.save(variant);
        }
    }
}
