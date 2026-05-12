package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.dto.AddToCartRequest;
import com.badribhaiapparel.dto.CartDTO;
import com.badribhaiapparel.dto.CartItemDTO;
import com.badribhaiapparel.entity.Cart;
import com.badribhaiapparel.entity.CartItem;
import com.badribhaiapparel.entity.Product;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.repository.CartItemRepository;
import com.badribhaiapparel.repository.CartRepository;
import com.badribhaiapparel.repository.ProductRepository;
import com.badribhaiapparel.repository.UserRepository;
import com.badribhaiapparel.service.CartService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final com.badribhaiapparel.repository.ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final com.badribhaiapparel.repository.CouponRepository couponRepository;

    public CartServiceImpl(CartRepository cartRepository, 
                           CartItemRepository cartItemRepository, 
                           ProductRepository productRepository, 
                           com.badribhaiapparel.repository.ProductVariantRepository variantRepository,
                           UserRepository userRepository,
                           com.badribhaiapparel.repository.CouponRepository couponRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.userRepository = userRepository;
        this.couponRepository = couponRepository;
    }

    @Override
    @Transactional
    public CartDTO getCart(String email) {
        Cart cart = getOrCreateCart(email);
        return mapToDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO addToCart(String email, AddToCartRequest request) {
        Cart cart = getOrCreateCart(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        com.badribhaiapparel.entity.ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = variantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));
        }

        // Check if item already exists in cart with same size, color AND variantId
        com.badribhaiapparel.entity.ProductVariant finalVariant = variant;
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()) &&
                        (finalVariant == null || (item.getVariant() != null && item.getVariant().getId().equals(finalVariant.getId()))) &&
                        item.getSelectedSize().equals(request.getSize()) &&
                        item.getSelectedColor().equals(request.getColor()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .product(product)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .selectedSize(request.getSize())
                    .selectedColor(request.getColor())
                    .cart(cart)
                    .build();
            cart.getItems().add(newItem);
        }

        updateCartTotal(cart);
        Cart savedCart = cartRepository.save(cart);
        return mapToDTO(savedCart);
    }

    @Override
    @Transactional
    public CartDTO updateQuantity(String email, Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!item.getCart().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        item.setQuantity(quantity);
        updateCartTotal(item.getCart());
        Cart savedCart = cartRepository.save(item.getCart());
        return mapToDTO(savedCart);
    }

    @Override
    @Transactional
    public CartDTO removeFromCart(String email, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        Cart cart = item.getCart();
        cart.getItems().remove(item);
        updateCartTotal(cart);
        Cart savedCart = cartRepository.save(cart);
        return mapToDTO(savedCart);
    }

    @Override
    @Transactional
    public CartDTO applyCoupon(String email, String couponCode) {
        Cart cart = getOrCreateCart(email);
        com.badribhaiapparel.entity.Coupon coupon = couponRepository.findByCodeIgnoreCase(couponCode)
                .orElseThrow(() -> new RuntimeException("Invalid coupon code"));

        if (!coupon.isActive()) {
            throw new RuntimeException("Coupon is no longer active");
        }

        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Coupon has expired");
        }

        if (coupon.getMinOrderAmount() != null && cart.getTotalPrice() < coupon.getMinOrderAmount()) {
            throw new RuntimeException("Minimum order amount for this coupon is " + coupon.getMinOrderAmount());
        }

        double discount = 0.0;
        if ("PERCENTAGE".equals(coupon.getDiscountType())) {
            discount = cart.getTotalPrice() * (coupon.getDiscountValue() / 100.0);
        } else {
            discount = coupon.getDiscountValue();
        }

        cart.setAppliedCoupon(coupon.getCode());
        cart.setDiscountAmount(discount);
        updateCartTotal(cart);
        
        Cart savedCart = cartRepository.save(cart);
        return mapToDTO(savedCart);
    }

    @Override
    @Transactional
    public CartDTO removeCoupon(String email) {
        Cart cart = getOrCreateCart(email);
        cart.setAppliedCoupon(null);
        cart.setDiscountAmount(0.0);
        updateCartTotal(cart);
        
        Cart savedCart = cartRepository.save(cart);
        return mapToDTO(savedCart);
    }

    @Override
    @Transactional
    public void clearCart(String email) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().clear();
        cart.setTotalPrice(0.0);
        cart.setAppliedCoupon(null);
        cart.setDiscountAmount(0.0);
        cart.setFinalPrice(0.0);
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
                
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setTotalPrice(0.0);
                    try {
                        return cartRepository.save(newCart);
                    } catch (Exception e) {
                        // Fallback in case of race condition: try fetching again
                        return cartRepository.findByUser(user)
                                .orElseThrow(() -> new RuntimeException("Failed to create or retrieve cart", e));
                    }
                });
    }

    private void updateCartTotal(Cart cart) {
        double total = cart.getItems().stream()
                .mapToDouble(item -> {
                    Double price;
                    if (item.getVariant() != null) {
                        price = item.getVariant().getPrice().doubleValue();
                    } else {
                        Product product = item.getProduct();
                        price = (product.getDiscountPrice() != null && product.getDiscountPrice() > 0) 
                                       ? product.getDiscountPrice() : product.getPrice();
                    }
                    return (price != null ? price : 0.0) * item.getQuantity();
                })
                .sum();
        cart.setTotalPrice(total);
        
        // If coupon is applied, recalculate discount if it's percentage based
        if (cart.getAppliedCoupon() != null) {
            couponRepository.findByCodeIgnoreCase(cart.getAppliedCoupon()).ifPresent(coupon -> {
                double discount = 0.0;
                if ("PERCENTAGE".equals(coupon.getDiscountType())) {
                    discount = total * (coupon.getDiscountValue() / 100.0);
                } else {
                    discount = coupon.getDiscountValue();
                }
                cart.setDiscountAmount(discount);
            });
        }
        
        double discountAmt = cart.getDiscountAmount() != null ? cart.getDiscountAmount() : 0.0;
        cart.setFinalPrice(Math.max(0, total - discountAmt));
    }

    private CartDTO mapToDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(item -> {
                    Product product = item.getProduct();
                    com.badribhaiapparel.entity.ProductVariant variant = item.getVariant();
                    String title = product != null ? product.getTitle() : "Unknown Product";
                    if (variant != null && variant.getSize() != null) {
                        title += " (" + variant.getSize() + (variant.getColor() != null ? " / " + variant.getColor() : "") + ")";
                    }
                    
                    String image = (product != null && product.getImages() != null && !product.getImages().isEmpty()) 
                                   ? product.getImages().get(0).getUrl() : "";
                    
                    Double currentPrice;
                    Double originalPrice;
                    
                    if (variant != null) {
                        currentPrice = variant.getPrice().doubleValue();
                        originalPrice = variant.getPrice().doubleValue(); // Or use base price as original?
                    } else {
                        currentPrice = (product != null && product.getDiscountPrice() != null && product.getDiscountPrice() > 0) 
                                             ? product.getDiscountPrice() : (product != null ? product.getPrice() : 0.0);
                        originalPrice = product != null ? product.getPrice() : 0.0;
                    }
                    
                    return new CartItemDTO(
                        item.getId(),
                        product != null ? product.getId() : null,
                        title,
                        image,
                        currentPrice,
                        originalPrice,
                        item.getQuantity(),
                        item.getSelectedSize(),
                        item.getSelectedColor()
                    );
                })
                .collect(Collectors.toList());

        return new CartDTO(
            cart.getId(), 
            itemDTOs, 
            cart.getTotalPrice() != null ? cart.getTotalPrice() : 0.0,
            cart.getAppliedCoupon(),
            cart.getDiscountAmount() != null ? cart.getDiscountAmount() : 0.0,
            cart.getFinalPrice() != null ? cart.getFinalPrice() : 0.0
        );
    }
}
