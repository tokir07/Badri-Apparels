package com.badribhaiapparel.dto;

import java.util.List;

public class CartDTO {
    private Long id;
    private List<CartItemDTO> items;
    private Double totalPrice;
    private String appliedCoupon;
    private Double discountAmount;
    private Double finalPrice;

    public CartDTO() {}

    public CartDTO(Long id, List<CartItemDTO> items, Double totalPrice, String appliedCoupon, Double discountAmount, Double finalPrice) {
        this.id = id;
        this.items = items;
        this.totalPrice = totalPrice;
        this.appliedCoupon = appliedCoupon;
        this.discountAmount = discountAmount;
        this.finalPrice = finalPrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public List<CartItemDTO> getItems() { return items; }
    public void setItems(List<CartItemDTO> items) { this.items = items; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public String getAppliedCoupon() { return appliedCoupon; }
    public void setAppliedCoupon(String appliedCoupon) { this.appliedCoupon = appliedCoupon; }
    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }
    public Double getFinalPrice() { return finalPrice; }
    public void setFinalPrice(Double finalPrice) { this.finalPrice = finalPrice; }
}
