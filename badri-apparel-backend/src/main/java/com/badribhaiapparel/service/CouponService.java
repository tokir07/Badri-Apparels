package com.badribhaiapparel.service;

import com.badribhaiapparel.dto.CouponValidationResult;
import com.badribhaiapparel.entity.Coupon;
import com.badribhaiapparel.entity.User;
import java.util.List;

public interface CouponService {
    CouponValidationResult validateCoupon(String code, User user, Double cartTotal);
    List<Coupon> getAllCoupons();
    Coupon createCoupon(Coupon coupon);
    Coupon updateCoupon(Long id, Coupon coupon);
    void deleteCoupon(Long id);
    void incrementUsage(String code);
}
