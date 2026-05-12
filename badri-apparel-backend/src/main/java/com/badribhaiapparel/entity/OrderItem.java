package com.badribhaiapparel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    private Double price;

    private String selectedSize;

    private String selectedColor;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Order order;

    public OrderItem() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getSelectedSize() { return selectedSize; }
    public void setSelectedSize(String selectedSize) { this.selectedSize = selectedSize; }
    public String getSelectedColor() { return selectedColor; }
    public void setSelectedColor(String selectedColor) { this.selectedColor = selectedColor; }
    public ProductVariant getVariant() { return variant; }
    public void setVariant(ProductVariant variant) { this.variant = variant; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public static OrderItemBuilder builder() { return new OrderItemBuilder(); }

    public static class OrderItemBuilder {
        private Product product;
        private ProductVariant variant;
        private Integer quantity;
        private Double price;
        private String selectedSize;
        private String selectedColor;
        private Order order;

        public OrderItemBuilder product(Product product) { this.product = product; return this; }
        public OrderItemBuilder variant(ProductVariant variant) { this.variant = variant; return this; }
        public OrderItemBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public OrderItemBuilder price(Double price) { this.price = price; return this; }
        public OrderItemBuilder selectedSize(String selectedSize) { this.selectedSize = selectedSize; return this; }
        public OrderItemBuilder selectedColor(String selectedColor) { this.selectedColor = selectedColor; return this; }
        public OrderItemBuilder order(Order order) { this.order = order; return this; }
        public OrderItem build() {
            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setVariant(variant);
            item.setQuantity(quantity);
            item.setPrice(price);
            item.setSelectedSize(selectedSize);
            item.setSelectedColor(selectedColor);
            item.setOrder(order);
            return item;
        }
    }
}
