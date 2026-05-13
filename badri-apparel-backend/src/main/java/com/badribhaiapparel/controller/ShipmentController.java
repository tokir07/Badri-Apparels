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
    private final com.badribhaiapparel.repository.OrderRepository orderRepository;
    private final com.badribhaiapparel.repository.UserRepository userRepository;

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
    public ResponseEntity<ApiResponse<ShipmentDTO>> getTracking(
            @PathVariable Long id,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        
        com.badribhaiapparel.entity.Order order = orderRepository.findById(id)
                .orElseThrow(() -> new com.badribhaiapparel.exception.ResourceNotFoundException("Order not found"));

        com.badribhaiapparel.entity.User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new com.badribhaiapparel.exception.ResourceNotFoundException("User not found"));

        boolean isOwner = order.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN")
                       || currentUser.getRole().name().equals("MANAGER");

        if (!isOwner && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException("You do not have permission to track this order");
        }

        ShipmentDTO tracking = shipmentService.getTracking(id);
        return ResponseEntity.ok(ApiResponse.<ShipmentDTO>builder()
                .success(true)
                .message("Tracking info retrieved successfully")
                .data(tracking)
                .build());
    }
}
