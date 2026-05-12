package com.badribhaiapparel.dto;

public record ProductImageDto(
    java.util.UUID id,
    String url,
    String altText,
    boolean isFeatured
) {}
