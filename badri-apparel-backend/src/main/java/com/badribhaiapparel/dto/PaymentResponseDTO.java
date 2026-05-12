package com.badribhaiapparel.dto;

public class PaymentResponseDTO {
    private String razorpayOrderId;
    private String amount;
    private String currency;
    private String keyId;
    private String customerName;
    private String customerEmail;
    private String customerContact;

    public PaymentResponseDTO() {}

    public PaymentResponseDTO(String razorpayOrderId, String amount, String currency, String keyId, 
                              String customerName, String customerEmail, String customerContact) {
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.currency = currency;
        this.keyId = keyId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerContact = customerContact;
    }

    // Builder-like pattern for compatibility
    public static PaymentResponseDTOBuilder builder() {
        return new PaymentResponseDTOBuilder();
    }

    public static class PaymentResponseDTOBuilder {
        private String razorpayOrderId;
        private String amount;
        private String currency;
        private String keyId;
        private String customerName;
        private String customerEmail;
        private String customerContact;

        public PaymentResponseDTOBuilder razorpayOrderId(String id) { this.razorpayOrderId = id; return this; }
        public PaymentResponseDTOBuilder amount(String amount) { this.amount = amount; return this; }
        public PaymentResponseDTOBuilder currency(String currency) { this.currency = currency; return this; }
        public PaymentResponseDTOBuilder keyId(String keyId) { this.keyId = keyId; return this; }
        public PaymentResponseDTOBuilder customerName(String name) { this.customerName = name; return this; }
        public PaymentResponseDTOBuilder customerEmail(String email) { this.customerEmail = email; return this; }
        public PaymentResponseDTOBuilder customerContact(String contact) { this.customerContact = contact; return this; }
        
        public PaymentResponseDTO build() {
            return new PaymentResponseDTO(razorpayOrderId, amount, currency, keyId, customerName, customerEmail, customerContact);
        }
    }

    // Getters and Setters
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getCustomerContact() { return customerContact; }
    public void setCustomerContact(String customerContact) { this.customerContact = customerContact; }
}
