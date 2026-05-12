package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.dto.UploadResultDto;
import com.badribhaiapparel.service.CloudinaryService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png", "image/webp");

    @Override
    public UploadResultDto uploadImage(MultipartFile file, String folder) throws IOException {
        validateFile(file);

        String cloudinaryFolder = "badribhai/" + folder;
        
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
            ObjectUtils.asMap(
                "folder", cloudinaryFolder,
                "resource_type", "auto",
                "quality", "auto",
                "fetch_format", "auto"
            )
        );

        return UploadResultDto.builder()
                .publicId((String) uploadResult.get("public_id"))
                .url((String) uploadResult.get("url"))
                .secureUrl((String) uploadResult.get("secure_url"))
                .width((int) uploadResult.get("width"))
                .height((int) uploadResult.get("height"))
                .format((String) uploadResult.get("format"))
                .bytes(Long.valueOf(uploadResult.get("bytes").toString()))
                .build();
    }

    @Override
    public void deleteImage(String publicId) throws IOException {
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Cloudinary delete result for publicId {}: {}", publicId, result);
        } catch (Exception e) {
            log.error("Failed to delete image from Cloudinary: {}", publicId, e);
            throw new IOException("Failed to delete image from cloud storage");
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload empty file");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds the 5MB limit");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new RuntimeException("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
        }
    }
}
