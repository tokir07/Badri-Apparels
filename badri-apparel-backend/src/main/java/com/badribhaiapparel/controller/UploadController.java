package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.UploadResultDto;
import com.badribhaiapparel.entity.Product;
import com.badribhaiapparel.entity.ProductImage;
import com.badribhaiapparel.repository.ProductImageRepository;
import com.badribhaiapparel.repository.ProductRepository;
import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/upload")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;

    @PostMapping("/image")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<UploadResultDto>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("folder") String folder,
            @RequestParam(value = "productId", required = false) Long productId) throws IOException {

        UploadResultDto result = cloudinaryService.uploadImage(file, folder);

        if (productId != null) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            ProductImage productImage = new ProductImage();
            productImage.setProduct(product);
            productImage.setUrl(result.getSecureUrl());
            productImage.setPublicId(result.getPublicId());
            // Set as main if it's the first image
            productImage.setMain(product.getImages() == null || product.getImages().isEmpty());
            productImageRepository.save(productImage);
        }

        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", result));
    }

    @PostMapping("/delete")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@RequestBody Map<String, String> request) throws IOException {
        String publicId = request.get("publicId");
        if (publicId == null || publicId.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Public ID is required"));
        }

        cloudinaryService.deleteImage(publicId);
        
        // Also remove from database if exists
        productImageRepository.findByPublicId(publicId).ifPresent(productImageRepository::delete);

        return ResponseEntity.ok(ApiResponse.success("Image deleted successfully", null));
    }
}
