package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.ShipmentDTO;
import com.badribhaiapparel.dto.ShipmentRequest;
import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PatchMapping("/admin/orders/{id}/shipment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ShipmentDTO>> updateShipment(
            @PathVariable Long id,
            @RequestBody ShipmentRequest request) {
        
        ShipmentDTO updatedShipment = shipmentService.updateShipment(id, request);
        return ResponseEntity.ok(ApiResponse.<ShipmentDTO>builder()
                .success(true)
                .message("Shipment info updated and order marked as SHIPPED")
                .data(updatedShipment)
                .build());
    }

    @GetMapping("/orders/{id}/tracking")
    public ResponseEntity<ApiResponse<ShipmentDTO>> getTracking(@PathVariable Long id) {
        // In a real app, verify that the order belongs to the current user
        ShipmentDTO tracking = shipmentService.getTracking(id);
        return ResponseEntity.ok(ApiResponse.<ShipmentDTO>builder()
                .success(true)
                .message("Tracking info retrieved successfully")
                .data(tracking)
                .build());
    }
}
