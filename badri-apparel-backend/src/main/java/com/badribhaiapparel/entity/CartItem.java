package com.badribhaiapparel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    private String selectedSize;

    private String selectedColor;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    public CartItem() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getSelectedSize() { return selectedSize; }
    public void setSelectedSize(String selectedSize) { this.selectedSize = selectedSize; }
    public String getSelectedColor() { return selectedColor; }
    public void setSelectedColor(String selectedColor) { this.selectedColor = selectedColor; }
    public ProductVariant getVariant() { return variant; }
    public void setVariant(ProductVariant variant) { this.variant = variant; }
    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }

    public static CartItemBuilder builder() { return new CartItemBuilder(); }

    public static class CartItemBuilder {
        private Product product;
        private ProductVariant variant;
        private Integer quantity;
        private String selectedSize;
        private String selectedColor;
        private Cart cart;

        public CartItemBuilder product(Product product) { this.product = product; return this; }
        public CartItemBuilder variant(ProductVariant variant) { this.variant = variant; return this; }
        public CartItemBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public CartItemBuilder selectedSize(String selectedSize) { this.selectedSize = selectedSize; return this; }
        public CartItemBuilder selectedColor(String selectedColor) { this.selectedColor = selectedColor; return this; }
        public CartItemBuilder cart(Cart cart) { this.cart = cart; return this; }
        public CartItem build() {
            CartItem item = new CartItem();
            item.setProduct(product);
            item.setVariant(variant);
            item.setQuantity(quantity);
            item.setSelectedSize(selectedSize);
            item.setSelectedColor(selectedColor);
            item.setCart(cart);
            return item;
        }
    }
}
