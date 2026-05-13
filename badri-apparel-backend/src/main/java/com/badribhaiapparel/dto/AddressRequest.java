package com.badribhaiapparel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AddressRequest {
    private String label; // Home, Work, Other
    
    @NotBlank(message = "Recipient name is required")
    private String recipientName;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    private String phone;
    
    @NotBlank(message = "Address line 1 is required")
    private String line1;
    
    private String line2;
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "State is required")
    private String state;
    
    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^\\d{6}$", message = "6-digit pincode required")
    private String pincode;
    
    private String country = "India";
    private boolean isDefault = false;
}
