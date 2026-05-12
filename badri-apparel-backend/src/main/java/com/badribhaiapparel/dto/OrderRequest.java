package com.badribhaiapparel.dto;

import java.util.List;

public class OrderRequest {
    private String shippingAddress;
    private String phoneNumber;
    private String paymentMethod;
    private List<OrderItemRequest> items;
    private String couponCode;

    public OrderRequest() {}

    public OrderRequest(String shippingAddress, String phoneNumber, String paymentMethod, List<OrderItemRequest> items, String couponCode) {
        this.shippingAddress = shippingAddress;
        this.phoneNumber = phoneNumber;
        this.paymentMethod = paymentMethod;
        this.items = items;
        this.couponCode = couponCode;
    }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public static OrderRequestBuilder builder() { return new OrderRequestBuilder(); }

    public static class OrderRequestBuilder {
        private String shippingAddress;
        private String phoneNumber;
        private String paymentMethod;
        private List<OrderItemRequest> items;
        private String couponCode;

        public OrderRequestBuilder shippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; return this; }
        public OrderRequestBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public OrderRequestBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public OrderRequestBuilder items(List<OrderItemRequest> items) { this.items = items; return this; }
        public OrderRequestBuilder couponCode(String couponCode) { this.couponCode = couponCode; return this; }

        public OrderRequest build() {
            return new OrderRequest(shippingAddress, phoneNumber, paymentMethod, items, couponCode);
        }
    }

    public static class OrderItemRequest {
        private Long productId;
        private java.util.UUID variantId;
        private Integer quantity;
        private String selectedSize;
        private String selectedColor;

        public OrderItemRequest() {}

        public OrderItemRequest(Long productId, java.util.UUID variantId, Integer quantity, String selectedSize, String selectedColor) {
            this.productId = productId;
            this.variantId = variantId;
            this.quantity = quantity;
            this.selectedSize = selectedSize;
            this.selectedColor = selectedColor;
        }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public java.util.UUID getVariantId() { return variantId; }
        public void setVariantId(java.util.UUID variantId) { this.variantId = variantId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getSelectedSize() { return selectedSize; }
        public void setSelectedSize(String selectedSize) { this.selectedSize = selectedSize; }
        public String getSelectedColor() { return selectedColor; }
        public void setSelectedColor(String selectedColor) { this.selectedColor = selectedColor; }

        public static OrderItemRequestBuilder builder() { return new OrderItemRequestBuilder(); }

        public static class OrderItemRequestBuilder {
            private Long productId;
            private java.util.UUID variantId;
            private Integer quantity;
            private String selectedSize;
            private String selectedColor;

            public OrderItemRequestBuilder productId(Long productId) { this.productId = productId; return this; }
            public OrderItemRequestBuilder variantId(java.util.UUID variantId) { this.variantId = variantId; return this; }
            public OrderItemRequestBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
            public OrderItemRequestBuilder selectedSize(String selectedSize) { this.selectedSize = selectedSize; return this; }
            public OrderItemRequestBuilder selectedColor(String selectedColor) { this.selectedColor = selectedColor; return this; }

            public OrderItemRequest build() {
                return new OrderItemRequest(productId, variantId, quantity, selectedSize, selectedColor);
            }
        }
    }
}
