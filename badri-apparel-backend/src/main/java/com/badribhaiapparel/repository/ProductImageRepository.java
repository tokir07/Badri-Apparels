package com.badribhaiapparel.repository;

import com.badribhaiapparel.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {
    List<ProductImage> findByProductIdOrderBySortOrderAsc(Long productId);
    List<ProductImage> findByVariantIdOrderBySortOrderAsc(UUID variantId);
    java.util.Optional<ProductImage> findByPublicId(String publicId);
}
