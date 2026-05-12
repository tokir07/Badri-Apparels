package com.badribhaiapparel.service;

import com.badribhaiapparel.dto.AuthResponse;
import com.badribhaiapparel.dto.LoginRequest;
import com.badribhaiapparel.dto.SignupRequest;

public interface AuthService {
    AuthResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String token);
    void logout(String token);
}
