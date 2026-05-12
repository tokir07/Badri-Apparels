package com.badribhaiapparel.service;

import com.badribhaiapparel.dto.UpdateProfileRequest;
import com.badribhaiapparel.dto.AuthResponse;
import com.badribhaiapparel.entity.User;

public interface UserService {
    AuthResponse updateProfile(String email, UpdateProfileRequest profileData);
    User getUserByEmail(String email);
}
