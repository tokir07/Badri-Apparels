package com.badribhaiapparel.mapper;

import com.badribhaiapparel.dto.ProductDTO;
import com.badribhaiapparel.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    
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
            
            dto.setMinPrice(min);
            dto.setMaxPrice(max);
            dto.setTotalStock(total);
        }
    }
}
