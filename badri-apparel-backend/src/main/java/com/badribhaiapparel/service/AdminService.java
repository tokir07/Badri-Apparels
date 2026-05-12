package com.badribhaiapparel.service;

import com.badribhaiapparel.dto.DashboardStatsDTO;
import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.entity.OrderStatus;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.entity.Role;
import java.util.List;

public interface AdminService {
    DashboardStatsDTO getDashboardStats();
    com.badribhaiapparel.dto.DashboardSummaryDTO getDashboardSummary();
    List<Order> getAllOrders();
    Order updateOrderStatus(Long orderId, OrderStatus status);
    List<User> getAllUsers();
    User updateUserStatus(Long userId, boolean isActive);
    void deleteUser(Long userId);
}
