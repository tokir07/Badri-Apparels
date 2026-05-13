package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.dto.CouponValidationResult;
import com.badribhaiapparel.entity.Coupon;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.repository.CouponRepository;
import com.badribhaiapparel.repository.OrderRepository;
import com.badribhaiapparel.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final OrderRepository orderRepository;

    @Override
    public CouponValidationResult validateCoupon(String code, User user, Double cartTotal) {
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndDeletedAtIsNull(code)
                .orElse(null);

        if (coupon == null || !coupon.isActive()) {
            return CouponValidationResult.builder().valid(false).message("Invalid or inactive coupon code").build();
        }

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getStartsAt() != null && coupon.getStartsAt().isAfter(now)) {
            return CouponValidationResult.builder().valid(false).message("Coupon is not yet active").build();
        }
        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(now)) {
            return CouponValidationResult.builder().valid(false).message("Coupon has expired").build();
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return CouponValidationResult.builder().valid(false).message("Coupon usage limit reached").build();
        }

        if (user != null && coupon.getUsageLimitPerUser() != null) {
            long userUsage = orderRepository.countByCouponCodeAndUser(coupon.getCode(), user);
            if (userUsage >= coupon.getUsageLimitPerUser()) {
                return CouponValidationResult.builder().valid(false).message("You have already used this coupon").build();
            }
        }

        if (coupon.getMinOrderAmount() != null && cartTotal < coupon.getMinOrderAmount()) {
            return CouponValidationResult.builder().valid(false).message("Minimum order amount ₹" + coupon.getMinOrderAmount() + " required").build();
        }

        double discount = 0;
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            discount = cartTotal * (coupon.getDiscountValue() / 100.0);
            if (coupon.getMaxDiscountAmount() != null && discount > coupon.getMaxDiscountAmount()) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else {
            discount = coupon.getDiscountValue();
        }

        return CouponValidationResult.builder()
                .valid(true)
                .discountAmount(discount)
                .message("Success! Discount of ₹" + String.format("%.2f", discount) + " applied.")
                .build();
    }

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    public Coupon updateCoupon(Long id, Coupon coupon) {
        Coupon existing = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        
        existing.setCode(coupon.getCode());
        existing.setDiscountValue(coupon.getDiscountValue());
        existing.setDiscountType(coupon.getDiscountType());
        existing.setMinOrderAmount(coupon.getMinOrderAmount());
        existing.setMaxDiscountAmount(coupon.getMaxDiscountAmount());
        existing.setUsageLimit(coupon.getUsageLimit());
        existing.setUsageLimitPerUser(coupon.getUsageLimitPerUser());
        existing.setStartsAt(coupon.getStartsAt());
        existing.setExpiryDate(coupon.getExpiryDate());
        existing.setActive(coupon.isActive());
        
        return couponRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setDeletedAt(LocalDateTime.now());
        couponRepository.save(coupon);
    }

    @Override
    @Transactional
    public void incrementUsage(String code) {
        couponRepository.findByCodeIgnoreCaseAndDeletedAtIsNull(code).ifPresent(coupon -> {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        });
    }
}
