package com.badribhaiapparel.dto;

import com.badribhaiapparel.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
    @NotBlank(message = "First name is required")
    String firstName,
    
    @NotBlank(message = "Last name is required")
    String lastName,
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    String email,
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password should be at least 6 characters")
    String password,
    
    String phoneNumber,
    Role role,
    
    // Additional fields for premium signup
    String gender,
    String dateOfBirth,
    String country,
    String state,
    String city,
    String pincode,
    String addressLine,
    boolean newsletterSubscribed
) {}
