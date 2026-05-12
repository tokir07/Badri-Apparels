package com.badribhaiapparel.service;

import com.badribhaiapparel.dto.AddToCartRequest;
import com.badribhaiapparel.dto.CartDTO;

public interface CartService {
    CartDTO getCart(String email);
    CartDTO addToCart(String email, AddToCartRequest request);
    CartDTO updateQuantity(String email, Long itemId, Integer quantity);
    CartDTO removeFromCart(String email, Long itemId);
    CartDTO applyCoupon(String email, String couponCode);
    CartDTO removeCoupon(String email);
    void clearCart(String email);
}
