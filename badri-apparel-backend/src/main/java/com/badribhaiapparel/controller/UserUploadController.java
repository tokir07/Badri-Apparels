package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.UploadResultDto;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.repository.UserRepository;
import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserUploadController {

    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;

    @PostMapping("/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File is empty"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !List.of("image/jpeg", "image/png", "image/webp").contains(contentType)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Only JPG, PNG, and WebP images are allowed"));
        }

        if (file.getSize() > 2 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File size must be under 2MB"));
        }

        // Upload to Cloudinary folder "avatars"
        UploadResultDto result = cloudinaryService.uploadImage(file, "avatars");

        // Delete old avatar if exists
        if (user.getCloudinaryPublicId() != null) {
            try {
                cloudinaryService.deleteImage(user.getCloudinaryPublicId());
            } catch (Exception e) {
                // Ignore delete errors for old images
            }
        }

        // Update user profile
        user.setProfileImage(result.getSecureUrl());
        user.setCloudinaryPublicId(result.getPublicId());
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Avatar updated successfully", 
                Map.of("avatarUrl", result.getSecureUrl())));
    }
}
