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
    private final com.badribhaiapparel.mapper.UserMapper userMapper;

    public UserController(UserService userService, com.badribhaiapparel.mapper.UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
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
    public ResponseEntity<ApiResponse<com.badribhaiapparel.dto.UserResponseDto>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        com.badribhaiapparel.entity.User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(ApiResponse.<com.badribhaiapparel.dto.UserResponseDto>builder()
                .success(true)
                .data(userMapper.toDto(user))
                .build());
    }

    @PostMapping("/newsletter/subscribe")
    public ResponseEntity<ApiResponse<Void>> subscribeNewsletter(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
        }
        userService.subscribeNewsletter(email);
        return ResponseEntity.ok(ApiResponse.success("Welcome to the BadriBhai heritage circle", null));
    }
}
