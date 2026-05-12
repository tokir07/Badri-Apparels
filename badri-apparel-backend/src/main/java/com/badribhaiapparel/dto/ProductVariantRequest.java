package com.badribhaiapparel.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProductVariantRequest(
    @NotBlank(message = "SKU is required") String sku,
    String size,
    String color,
    String colorHex,
    @NotNull(message = "MRP is required") BigDecimal mrp,
    @NotNull(message = "Price is required") BigDecimal price,
    BigDecimal costPrice,
    @Min(value = 0, message = "Stock cannot be negative") int stock,
    int lowStockThreshold
) {}
