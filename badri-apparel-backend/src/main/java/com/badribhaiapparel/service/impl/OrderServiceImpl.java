package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.entity.OrderItem;
import com.badribhaiapparel.entity.OrderStatus;
import com.badribhaiapparel.entity.Product;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.repository.OrderRepository;
import com.badribhaiapparel.repository.ProductRepository;
import com.badribhaiapparel.service.EmailService;
import com.badribhaiapparel.service.InvoiceService;
import com.badribhaiapparel.service.OrderService;
import com.badribhaiapparel.entity.ProductVariant;
import com.badribhaiapparel.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public Order createOrder(Order order, User user) {
        // Keeping legacy method for internal use if needed, but primarily using request-based creation
        order.setOrderNumber("BADRI-" + System.currentTimeMillis());
        order.setCreatedAt(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setUser(user);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order createOrderFromRequest(com.badribhaiapparel.dto.OrderRequest request, User user) {
        Order order = new Order();
        order.setOrderNumber("BADRI-" + System.currentTimeMillis());
        order.setCreatedAt(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus("PENDING");

        double totalAmount = 0;
        java.util.List<OrderItem> items = new java.util.ArrayList<>();

        for (com.badribhaiapparel.dto.OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            com.badribhaiapparel.entity.ProductVariant variant = null;
            if (itemReq.getVariantId() != null) {
                variant = variantRepository.findById(itemReq.getVariantId())
                        .orElseThrow(() -> new RuntimeException("Variant not found: " + itemReq.getVariantId()));
                
                if (variant.getStock() < itemReq.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for: " + product.getTitle() + " (" + variant.getSize() + ")");
                }
            } else if (product.getStock() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getTitle());
            }

            // Recalculate price server-side
            double price;
            if (variant != null) {
                price = variant.getPrice().doubleValue();
            } else {
                price = (product.getDiscountPrice() != null && product.getDiscountPrice() > 0) 
                               ? product.getDiscountPrice() : product.getPrice();
            }
            
            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setVariant(variant);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(price);
            item.setSelectedSize(itemReq.getSelectedSize());
            item.setSelectedColor(itemReq.getSelectedColor());
            item.setOrder(order);
            items.add(item);

            totalAmount += price * itemReq.getQuantity();

            // Update Stock
            if (variant != null) {
                variant.setStock(variant.getStock() - itemReq.getQuantity());
                variantRepository.save(variant);
            } else {
                product.setStock(product.getStock() - itemReq.getQuantity());
                productRepository.save(product);
            }
        }

        order.setItems(items);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        // Generate Invoice & Send Email asynchronously
        try {
            ByteArrayInputStream invoicePdf = invoiceService.generateInvoicePdf(savedOrder);
            emailService.sendOrderConfirmation(savedOrder, invoicePdf);
        } catch (Exception e) {
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }

        return savedOrder;
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setOrderStatus(OrderStatus.valueOf(status.toUpperCase()));
        
        // Trigger status specific emails
        emailService.sendShippingUpdate(order);
        
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
