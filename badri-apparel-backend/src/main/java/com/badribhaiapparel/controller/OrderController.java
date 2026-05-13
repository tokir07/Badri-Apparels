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
import com.badribhaiapparel.service.InvoiceService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.InputStreamResource;
import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private InvoiceService invoiceService;

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
    public ResponseEntity<Order> getOrder(@PathVariable Long id, Principal principal) {
        Order order = orderService.getOrderById(id);
        User user = userService.getUserByEmail(principal.getName());
        
        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ROLE_ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(order);
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber, Principal principal) {
        Order order = orderService.getOrderByOrderNumber(orderNumber);
        User user = userService.getUserByEmail(principal.getName());

        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ROLE_ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(order);
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

    @GetMapping("/{id}/invoice")
    public ResponseEntity<InputStreamResource> getInvoice(@PathVariable Long id, Principal principal) {
        Order order = orderService.getOrderById(id);
        User user = userService.getUserByEmail(principal.getName());

        // Check authorization: only owner or admin can download invoice
        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ROLE_ADMIN")) {
            return ResponseEntity.status(403).build();
        }

        ByteArrayInputStream bis = invoiceService.generateInvoicePdf(order);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=invoice-" + order.getOrderNumber() + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}
