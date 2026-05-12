package com.badribhaiapparel.dto;

public class AddToCartRequest {
    private Long productId;
    private Integer quantity;
    private String size;
    private String color;

    private java.util.UUID variantId;

    public AddToCartRequest() {}

    public AddToCartRequest(Long productId, java.util.UUID variantId, Integer quantity, String size, String color) {
        this.productId = productId;
        this.variantId = variantId;
        this.quantity = quantity;
        this.size = size;
        this.color = color;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public java.util.UUID getVariantId() { return variantId; }
    public void setVariantId(java.util.UUID variantId) { this.variantId = variantId; }
}
