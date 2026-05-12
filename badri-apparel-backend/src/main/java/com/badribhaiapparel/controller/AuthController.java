package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.AuthResponse;
import com.badribhaiapparel.dto.LoginRequest;
import com.badribhaiapparel.dto.SignupRequest;
import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("User registered successfully")
                .data(authService.signup(request))
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Login successful")
                .data(authService.login(request))
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestBody com.badribhaiapparel.dto.TokenRequest request) {
        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Token refreshed successfully")
                .data(authService.refreshToken(request.getRefreshToken()))
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody com.badribhaiapparel.dto.TokenRequest request) {
        authService.logout(request.getRefreshToken());
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Logged out successfully")
                .build();
        return ResponseEntity.ok(response);
    }
}
