package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.CouponValidationResult;
import com.badribhaiapparel.entity.Coupon;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.service.CouponService;
import com.badribhaiapparel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;
    private final UserService userService;

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<CouponValidationResult>> validateCoupon(@RequestBody Map<String, Object> request) {
        String code = (String) request.get("code");
        Double cartTotal = Double.valueOf(request.get("cartTotal").toString());
        
        // Try to get current user if logged in
        User user = null;
        try {
            user = userService.getCurrentUser();
        } catch (Exception e) {
            // Guest checkout or not logged in yet
        }

        CouponValidationResult result = couponService.validateCoupon(code, user, cartTotal);
        
        return ResponseEntity.ok(ApiResponse.<CouponValidationResult>builder()
                .success(result.isValid())
                .message(result.getMessage())
                .data(result)
                .build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Coupon>>> getAllCoupons() {
        return ResponseEntity.ok(ApiResponse.<List<Coupon>>builder()
                .success(true)
                .message("Coupons fetched successfully")
                .data(couponService.getAllCoupons())
                .build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(ApiResponse.<Coupon>builder()
                .success(true)
                .message("Coupon created successfully")
                .data(couponService.createCoupon(coupon))
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Coupon>> updateCoupon(@PathVariable Long id, @RequestBody Coupon coupon) {
        return ResponseEntity.ok(ApiResponse.<Coupon>builder()
                .success(true)
                .message("Coupon updated successfully")
                .data(couponService.updateCoupon(id, coupon))
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Coupon deleted successfully")
                .build());
    }
}
