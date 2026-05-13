package com.badribhaiapparel.dto;

import java.util.UUID;

public record ProductImageDto(
    UUID id,
    String url,
    String publicId,
    String altText,
    boolean isMain,
    int sortOrder
) {}
