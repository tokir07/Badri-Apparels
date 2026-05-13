package com.badribhaiapparel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDto {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private BigDecimal basePrice;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private int totalStock;
    private String fabric;
    private String printType;
    private Long categoryId;
    private String categoryName;
    private List<ProductVariantDto> variants;
    private List<ProductImageDto> images;
    private String metaTitle;
    private String metaDescription;
    private boolean isFeatured;
    private boolean isActive;
    private Instant createdAt;
}
