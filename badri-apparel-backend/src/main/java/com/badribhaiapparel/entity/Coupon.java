package com.badribhaiapparel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private Double discountValue;

    @Column(nullable = false)
    private String discountType; // "PERCENTAGE" or "FIXED"

    private Double minOrderAmount;
    
    private Double maxDiscountAmount;

    private Integer usageLimit;

    private Integer usageLimitPerUser = 1;

    private Integer usedCount = 0;

    private LocalDateTime startsAt;

    private LocalDateTime expiryDate;

    private LocalDateTime deletedAt;

    private boolean active = true;
}
