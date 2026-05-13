package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.ReviewDto;
import com.badribhaiapparel.dto.ReviewRequestDto;
import com.badribhaiapparel.entity.Product;
import com.badribhaiapparel.entity.Review;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.repository.OrderRepository;
import com.badribhaiapparel.repository.ProductRepository;
import com.badribhaiapparel.repository.ReviewRepository;
import com.badribhaiapparel.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, Review.ReviewStatus.APPROVED);
        
        List<ReviewDto> dtos = reviews.stream()
                .map(r -> ReviewDto.builder()
                        .id(r.getId())
                        .userName(r.getUser().getFirstName() + " " + r.getUser().getLastName())
                        .userAvatar(r.getUser().getProfileImage())
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .verifiedPurchase(r.isVerifiedPurchase())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(ApiResponse.<List<ReviewDto>>builder()
                .success(true)
                .data(dtos)
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> submitReview(
            @Valid @RequestBody ReviewRequestDto request,
            @AuthenticationPrincipal User user) {
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if user already reviewed
        if (reviewRepository.findByUserIdAndProductId(user.getId(), product.getId()).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("You have already reviewed this product"));
        }

        // Check if verified purchase (has a DELIVERED order with this product)
        boolean hasPurchased = orderRepository.existsByUserIdAndOrderStatusAndItemsProductId(
                user.getId(), com.badribhaiapparel.entity.OrderStatus.DELIVERED, product.getId());

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .verifiedPurchase(hasPurchased)
                .status(Review.ReviewStatus.APPROVED) // Auto-approve for now, can change to PENDING
                .build();

        reviewRepository.save(review);
        
        return ResponseEntity.ok(ApiResponse.success("Review submitted for verification", null));
    }
}
