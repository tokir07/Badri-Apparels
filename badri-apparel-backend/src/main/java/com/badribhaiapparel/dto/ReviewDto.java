package com.badribhaiapparel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private UUID id;
    private String userName;
    private String userAvatar;
    private Integer rating;
    private String comment;
    private boolean verifiedPurchase;
    private LocalDateTime createdAt;
}
