package com.badribhaiapparel.service;

import com.badribhaiapparel.dto.DashboardStatsDTO;
import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.entity.OrderStatus;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.entity.Role;
import java.util.List;

public interface AdminService {
    DashboardStatsDTO getDashboardStats();
    com.badribhaiapparel.dto.DashboardSummaryDTO getDashboardSummary(String range);
    List<com.badribhaiapparel.dto.OrderResponseDto> getAllOrders();
    com.badribhaiapparel.dto.OrderResponseDto updateOrderStatus(Long orderId, OrderStatus status);
    List<com.badribhaiapparel.dto.UserResponseDto> getAllUsers();
    com.badribhaiapparel.dto.UserResponseDto updateUserStatus(Long userId, boolean isActive);
    void deleteUser(Long userId);
}
