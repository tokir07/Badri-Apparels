package com.badribhaiapparel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String role;
    private String profileImage;
    private String gender;
    private String dateOfBirth;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String addressLine;
    private boolean isActive;
    private LocalDateTime createdAt;
}
