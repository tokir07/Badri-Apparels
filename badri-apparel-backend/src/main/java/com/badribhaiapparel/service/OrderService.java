package com.badribhaiapparel.service;

import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.entity.User;
import java.util.List;

public interface OrderService {
    Order createOrder(Order order, User user);
    Order createOrderFromRequest(com.badribhaiapparel.dto.OrderRequest request, User user);
    Order getOrderById(Long id);
    Order getOrderByOrderNumber(String orderNumber);
    List<Order> getOrdersByUser(User user);
    List<Order> getAllOrders();
    Order updateOrderStatus(Long id, String status);
    void deleteOrder(Long id);
}
