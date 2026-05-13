package com.badribhaiapparel.mapper;

import com.badribhaiapparel.dto.ProductDTO;
import com.badribhaiapparel.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {
    
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "images", target = "images")
    com.badribhaiapparel.dto.ProductResponseDto toResponseDto(Product product);

    java.util.List<com.badribhaiapparel.dto.ProductResponseDto> toResponseDtoList(java.util.List<Product> products);
    
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "images", target = "images")
    ProductDTO toDto(Product product);
    
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "images", ignore = true)
    Product toEntity(ProductDTO productDTO);

    com.badribhaiapparel.dto.ProductVariantDto toVariantDto(com.badribhaiapparel.entity.ProductVariant variant);
    com.badribhaiapparel.dto.ProductImageDto toImageDto(com.badribhaiapparel.entity.ProductImage image);

    @org.mapstruct.AfterMapping
    default void calculatePricesAndStock(com.badribhaiapparel.entity.Product product, @org.mapstruct.MappingTarget ProductDTO dto) {
        processPrices(product, dto);
    }

    @org.mapstruct.AfterMapping
    default void calculateResponsePrices(com.badribhaiapparel.entity.Product product, @org.mapstruct.MappingTarget com.badribhaiapparel.dto.ProductResponseDto dto) {
        processResponsePrices(product, dto);
    }

    private void processPrices(com.badribhaiapparel.entity.Product product, Object dto) {
        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            java.math.BigDecimal min = product.getVariants().stream()
                .filter(com.badribhaiapparel.entity.ProductVariant::isActive)
                .map(com.badribhaiapparel.entity.ProductVariant::getPrice)
                .min(java.math.BigDecimal::compareTo)
                .orElse(java.math.BigDecimal.ZERO);
            
            java.math.BigDecimal max = product.getVariants().stream()
                .filter(com.badribhaiapparel.entity.ProductVariant::isActive)
                .map(com.badribhaiapparel.entity.ProductVariant::getPrice)
                .max(java.math.BigDecimal::compareTo)
                .orElse(java.math.BigDecimal.ZERO);
            
            int total = product.getVariants().stream()
                .filter(com.badribhaiapparel.entity.ProductVariant::isActive)
                .mapToInt(com.badribhaiapparel.entity.ProductVariant::getStock)
                .sum();
            
            if (dto instanceof ProductDTO d) {
                d.setMinPrice(min);
                d.setMaxPrice(max);
                d.setTotalStock(total);
            } else if (dto instanceof com.badribhaiapparel.dto.ProductResponseDto d) {
                d.setMinPrice(min);
                d.setMaxPrice(max);
                d.setTotalStock(total);
            }
        }
    }

    private void processResponsePrices(com.badribhaiapparel.entity.Product product, com.badribhaiapparel.dto.ProductResponseDto dto) {
        processPrices(product, dto);
    }

    default java.time.Instant map(java.time.LocalDateTime value) {
        return value == null ? null : value.atZone(java.time.ZoneId.systemDefault()).toInstant();
    }
}
