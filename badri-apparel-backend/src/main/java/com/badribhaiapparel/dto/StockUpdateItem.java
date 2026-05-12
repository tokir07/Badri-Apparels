package com.badribhaiapparel.dto;

import java.util.UUID;

public record StockUpdateItem(
    UUID variantId,
    int quantityChange,
    String reason // e.g., "RESTOCK", "DAMAGE", "CORRECTION"
) {}
