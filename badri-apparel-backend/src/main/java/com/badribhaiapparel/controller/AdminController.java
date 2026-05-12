package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.DashboardStatsDTO;
import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.entity.OrderStatus;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getStats() {
        return ResponseEntity.ok(ApiResponse.<DashboardStatsDTO>builder()
                .success(true)
                .message("Dashboard stats fetched")
                .data(adminService.getDashboardStats())
                .build());
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<ApiResponse<com.badribhaiapparel.dto.DashboardSummaryDTO>> getSummary() {
        return ResponseEntity.ok(ApiResponse.<com.badribhaiapparel.dto.DashboardSummaryDTO>builder()
                .success(true)
                .message("Dashboard summary fetched")
                .data(adminService.getDashboardSummary())
                .build());
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.<List<Order>>builder()
                .success(true)
                .message("All orders fetched")
                .data(adminService.getAllOrders())
                .build());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(ApiResponse.<Order>builder()
                .success(true)
                .message("Order status updated")
                .data(adminService.updateOrderStatus(id, status))
                .build());
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.<List<User>>builder()
                .success(true)
                .message("All users fetched")
                .data(adminService.getAllUsers())
                .build());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @PathVariable Long id,
            @RequestParam boolean isActive) {
        return ResponseEntity.ok(ApiResponse.<User>builder()
                .success(true)
                .message("User status updated")
                .data(adminService.updateUserStatus(id, isActive))
                .build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("User deleted successfully")
                .build());
    }
}
