package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.AddressDto;
import com.badribhaiapparel.dto.AddressRequest;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAddresses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.<List<AddressDto>>builder()
                .success(true)
                .data(addressService.getUserAddresses(user.getId()))
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddressDto>> addAddress(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(ApiResponse.<AddressDto>builder()
                .success(true)
                .message("Address added successfully")
                .data(addressService.addAddress(user.getId(), request))
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressDto>> updateAddress(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(ApiResponse.<AddressDto>builder()
                .success(true)
                .message("Address updated successfully")
                .data(addressService.updateAddress(id, user.getId(), request))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        addressService.deleteAddress(id, user.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Address deleted successfully")
                .build());
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<ApiResponse<AddressDto>> setDefaultAddress(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.<AddressDto>builder()
                .success(true)
                .message("Default address updated")
                .data(addressService.setDefaultAddress(id, user.getId()))
                .build());
    }
}
