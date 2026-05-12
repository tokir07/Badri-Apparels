package com.badribhaiapparel.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    private Double totalPrice;
    
    private String appliedCoupon;
    private Double discountAmount = 0.0;
    private Double finalPrice;

    public Cart() {}


    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public String getAppliedCoupon() { return appliedCoupon; }
    public void setAppliedCoupon(String appliedCoupon) { this.appliedCoupon = appliedCoupon; }
    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }
    public Double getFinalPrice() { return finalPrice; }
    public void setFinalPrice(Double finalPrice) { this.finalPrice = finalPrice; }


    public static CartBuilder builder() { return new CartBuilder(); }

    public static class CartBuilder {
        private User user;
        private List<CartItem> items = new ArrayList<>();
        private Double totalPrice;

        public CartBuilder user(User user) { this.user = user; return this; }
        public CartBuilder items(List<CartItem> items) { this.items = items; return this; }
        public CartBuilder totalPrice(Double totalPrice) { this.totalPrice = totalPrice; return this; }
        public Cart build() {
            Cart cart = new Cart();
            cart.setUser(user);
            cart.setItems(items);
            cart.setTotalPrice(totalPrice);
            return cart;
        }
    }
}
