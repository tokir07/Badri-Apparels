package com.badribhaiapparel.repository;

import com.badribhaiapparel.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {
    
    List<ProductVariant> findByProductId(Long productId);
    
    Optional<ProductVariant> findBySku(String sku);
    
    List<ProductVariant> findByProductIdAndIsActiveTrue(Long productId);
    
    @Query("SELECT v FROM ProductVariant v JOIN FETCH v.product WHERE v.stock <= v.lowStockThreshold AND v.isActive = true")
    List<ProductVariant> findLowStockVariants();
}
