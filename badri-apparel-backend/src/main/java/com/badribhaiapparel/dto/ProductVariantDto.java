package com.badribhaiapparel.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductVariantDto(
    UUID id,
    String sku,
    String size,
    String color,
    String colorHex,
    BigDecimal mrp,
    BigDecimal price,
    int stock,
    boolean isActive
) {}
