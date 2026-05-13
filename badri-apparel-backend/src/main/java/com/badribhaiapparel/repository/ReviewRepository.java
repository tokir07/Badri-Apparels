package com.badribhaiapparel.repository;

import com.badribhaiapparel.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByProductIdAndStatusOrderByCreatedAtDesc(Long productId, Review.ReviewStatus status);
    
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = ?1 AND r.status = 'APPROVED'")
    Double getAverageRatingByProductId(Long productId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = ?1 AND r.status = 'APPROVED'")
    Long countApprovedReviewsByProductId(Long productId);
}
