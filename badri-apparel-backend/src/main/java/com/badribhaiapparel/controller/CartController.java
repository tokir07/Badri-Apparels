package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.AddToCartRequest;
import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.dto.CartDTO;
import com.badribhaiapparel.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDTO>> getCart(Authentication authentication) {
        String email = authentication.getName();
        CartDTO cart = cartService.getCart(email);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .success(true)
                .data(cart)
                .build());
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartDTO>> addToCart(
            Authentication authentication,
            @RequestBody AddToCartRequest request) {
        String email = authentication.getName();
        CartDTO cart = cartService.addToCart(email, request);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .success(true)
                .message("Product added to cart")
                .data(cart)
                .build());
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDTO>> updateQuantity(
            Authentication authentication,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        String email = authentication.getName();
        CartDTO cart = cartService.updateQuantity(email, itemId, quantity);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .success(true)
                .data(cart)
                .build());
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDTO>> removeFromCart(
            Authentication authentication,
            @PathVariable Long itemId) {
        String email = authentication.getName();
        CartDTO cart = cartService.removeFromCart(email, itemId);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .success(true)
                .message("Item removed from cart")
                .data(cart)
                .build());
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {
        String email = authentication.getName();
        cartService.clearCart(email);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Cart cleared")
                .build());
    }

    @PostMapping("/coupon/apply")
    public ResponseEntity<ApiResponse<CartDTO>> applyCoupon(
            Authentication authentication,
            @RequestParam String code) {
        String email = authentication.getName();
        CartDTO cart = cartService.applyCoupon(email, code);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .success(true)
                .message("Coupon applied successfully")
                .data(cart)
                .build());
    }

    @PostMapping("/coupon/remove")
    public ResponseEntity<ApiResponse<CartDTO>> removeCoupon(Authentication authentication) {
        String email = authentication.getName();
        CartDTO cart = cartService.removeCoupon(email);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .success(true)
                .message("Coupon removed")
                .data(cart)
                .build());
    }
}

