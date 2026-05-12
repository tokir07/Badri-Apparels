package com.badribhaiapparel.controller;

import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.dto.AuthResponse;
import com.badribhaiapparel.dto.UpdateProfileRequest;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<AuthResponse>> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest profileData) {
        
        String email = authentication.getName();
        AuthResponse updatedProfile = userService.updateProfile(email, profileData);
        
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(updatedProfile)
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(ApiResponse.<User>builder()
                .success(true)
                .data(user)
                .build());
    }
}
