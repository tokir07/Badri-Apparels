package com.badribhaiapparel.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequestDto {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    @NotBlank(message = "Comment cannot be empty")
    @Size(max = 1000, message = "Comment is too long")
    private String comment;
}
