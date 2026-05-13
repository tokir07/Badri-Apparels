package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.ProductResponseDto;
import com.badribhaiapparel.entity.Product;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.entity.Wishlist;
import com.badribhaiapparel.repository.ProductRepository;
import com.badribhaiapparel.repository.WishlistRepository;
import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> getWishlist(@AuthenticationPrincipal User user) {
        List<Wishlist> wishlists = wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<ProductResponseDto> products = wishlists.stream()
                .map(w -> productMapper.toResponseDto(w.getProduct()))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(ApiResponse.<List<ProductResponseDto>>builder()
                .success(true)
                .data(products)
                .build());
    }

    @PostMapping("/{productId}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> toggleWishlist(
            @PathVariable Long productId,
            @AuthenticationPrincipal User user) {
        
        return wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .map(w -> {
                    wishlistRepository.delete(w);
                    return ResponseEntity.ok(ApiResponse.<String>builder()
                            .success(true)
                            .message("Removed from wishlist")
                            .data("REMOVED")
                            .build());
                })
                .orElseGet(() -> {
                    Product product = productRepository.findById(productId)
                            .orElseThrow(() -> new RuntimeException("Product not found"));
                    
                    Wishlist wishlist = Wishlist.builder()
                            .user(user)
                            .product(product)
                            .build();
                    wishlistRepository.save(wishlist);
                    
                    return ResponseEntity.ok(ApiResponse.<String>builder()
                            .success(true)
                            .message("Added to wishlist")
                            .data("ADDED")
                            .build());
                });
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> checkWishlist(
            @PathVariable Long productId,
            @AuthenticationPrincipal User user) {
        boolean exists = wishlistRepository.existsByUserIdAndProductId(user.getId(), productId);
        return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                .success(true)
                .data(exists)
                .build());
    }
}
