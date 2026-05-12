package com.badribhaiapparel.controller;

import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.service.OrderService;
import com.badribhaiapparel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<com.badribhaiapparel.response.ApiResponse<Order>> createOrder(@RequestBody com.badribhaiapparel.dto.OrderRequest orderRequest, Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(com.badribhaiapparel.response.ApiResponse.<Order>builder()
                .success(true)
                .message("Order created successfully")
                .data(orderService.createOrderFromRequest(orderRequest, user))
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByOrderNumber(orderNumber));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(orderService.getOrdersByUser(user));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
