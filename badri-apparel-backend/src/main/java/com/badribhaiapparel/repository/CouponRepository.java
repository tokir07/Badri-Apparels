package com.badribhaiapparel.repository;

import com.badribhaiapparel.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeIgnoreCaseAndDeletedAtIsNull(String code);
    Optional<Coupon> findByCodeIgnoreCase(String code);
}
