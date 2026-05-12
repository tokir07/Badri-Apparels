package com.badribhaiapparel.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.badribhaiapparel.dto.CartDTO;
import com.badribhaiapparel.dto.CartItemDTO;
import com.badribhaiapparel.dto.PaymentResponseDTO;
import com.badribhaiapparel.dto.PaymentVerificationRequestDTO;
import com.badribhaiapparel.entity.*;
import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.repository.ProductRepository;
import com.badribhaiapparel.repository.PaymentRepository;
import com.badribhaiapparel.repository.OrderRepository;
import com.badribhaiapparel.service.CartService;
import com.badribhaiapparel.service.PaymentService;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.io.ByteArrayInputStream; // Artisanal stream import
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    @Value("${razorpay.currency}")
    private String currency;

    private final PaymentRepository paymentRepository;
    private final CartService cartService;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final com.badribhaiapparel.service.EmailService emailService;
    private final com.badribhaiapparel.service.ShipmentService shipmentService;
    private final com.badribhaiapparel.service.InvoiceService invoiceService;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
            CartService cartService,
            OrderRepository orderRepository,
            ProductRepository productRepository,
            com.badribhaiapparel.service.EmailService emailService,
            com.badribhaiapparel.service.ShipmentService shipmentService,
            com.badribhaiapparel.service.InvoiceService invoiceService) {
        this.paymentRepository = paymentRepository;
        this.cartService = cartService;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.emailService = emailService;
        this.shipmentService = shipmentService;
        this.invoiceService = invoiceService;
    }

    @Override
    @Transactional
    public PaymentResponseDTO createOrder(User user) throws Exception {
        log.info("Initiating Razorpay order creation for user: {}", user.getEmail());
        // 1. Get current cart total securely from backend
        CartDTO cart = cartService.getCart(user.getEmail());
        if (cart.getItems().isEmpty()) {
            log.error("Cart empty for user: {}", user.getEmail());
            throw new RuntimeException("Cart is empty");
        }

        double totalAmount = cart.getTotalPrice();

        // 2. Initialize Razorpay client
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        // 3. Create Razorpay order (amount in paise)
        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) Math.round(totalAmount * 100));
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);
            String rzpOrderId = razorpayOrder.get("id");
            log.info("Razorpay order created: {}", rzpOrderId);

            // 4. Save pending payment record
            Payment payment = Payment.builder()
                    .amount(totalAmount)
                    .currency(currency)
                    .paymentStatus(PaymentStatus.PENDING)
                    .razorpayOrderId(rzpOrderId)
                    .user(user)
                    .build();

            paymentRepository.save(payment);

            // 5. Prepare response for frontend
            return PaymentResponseDTO.builder()
                    .razorpayOrderId(rzpOrderId)
                    .amount(String.valueOf(totalAmount))
                    .currency(currency)
                    .keyId(keyId)
                    .customerName(user.getFirstName() + " " + user.getLastName())
                    .customerEmail(user.getEmail())
                    .customerContact(user.getPhoneNumber())
                    .build();
        } catch (Exception e) {
            log.error("Failed to create Razorpay order: {}", e.getMessage());
            throw new RuntimeException("Razorpay Order Creation Failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public boolean verifyPayment(PaymentVerificationRequestDTO request, User user) throws Exception {
        log.info("Verifying payment for order: {}", request.getRazorpayOrderId());
        
        // 1. Verify signature
        JSONObject attributes = new JSONObject();
        attributes.put("razorpay_order_id", request.getRazorpayOrderId());
        attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
        attributes.put("razorpay_signature", request.getRazorpaySignature());

        boolean isValid = Utils.verifyPaymentSignature(attributes, keySecret);

        if (!isValid) {
            log.warn("Invalid Razorpay signature for order: {}", request.getRazorpayOrderId());
            return false;
        }

        log.info("Signature valid. Fetching payment record...");
        // 2. Update payment record
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment record not found"));

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setTransactionTime(LocalDateTime.now());

        log.info("Creating order record for user: {}", user.getEmail());
        // 3. Create Order record
        CartDTO cart = cartService.getCart(user.getEmail());

        Order order = Order.builder()
                .user(user)
                .totalAmount(payment.getAmount())
                .shippingAddress(request.getShippingAddress())
                .paymentMethod("RAZORPAY")
                .paymentStatus("PAID")
                .orderStatus(OrderStatus.CONFIRMED)
                .transactionId(request.getRazorpayPaymentId())
                .payment(payment)
                .build();
        
        order.setCreatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);
        log.info("Order saved with internal ID: {}", savedOrder.getId());

        // 4. Map cart items to order items and update stock
        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            if (cartItem.getProductId() == null) {
                throw new RuntimeException("Product ID missing in cart item");
            }
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + cartItem.getProductId()));
            
            // Update stock
            if (product.getStock() < cartItem.getQuantity()) {
                log.error("Insufficient stock for product {}: required {}, available {}", product.getTitle(), cartItem.getQuantity(), product.getStock());
                throw new RuntimeException("Insufficient stock for product: " + product.getTitle());
            }
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            return OrderItem.builder()
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .selectedSize(cartItem.getSize())
                    .selectedColor(cartItem.getColor())
                    .order(savedOrder)
                    .build();
        }).collect(Collectors.toList());

        savedOrder.setItems(orderItems);
        
        // 5. Generate human-readable order number
        String year = String.valueOf(LocalDateTime.now().getYear());
        String formattedId = String.format("%04d", savedOrder.getId());
        savedOrder.setOrderNumber("#BADRI-" + year + "-" + formattedId);
        
        // Final save for order (cascades to items)
        orderRepository.save(savedOrder);
        log.info("Order persistence finalized for verified payment.");

        // 6. Notify Admin, Customer and Create Shipment
        try {
            log.info("Starting post-verification artisanal processes for order: {}", savedOrder.getOrderNumber());
            
            // Generate Invoice Silhouettes
            ByteArrayInputStream customerInvoice = invoiceService.generateInvoicePdf(savedOrder);
            ByteArrayInputStream adminInvoice = invoiceService.generateInvoicePdf(savedOrder);
            log.info("Invoice silhouettes generated successfully.");

            // User Confirmation
            emailService.sendOrderConfirmation(savedOrder, customerInvoice);
            log.info("Order confirmation email triggered for patron.");

            // Admin Notification
            emailService.sendAdminNewOrderNotification(savedOrder, adminInvoice);
            log.info("Admin notification triggered.");
            
            // Create Shipment record
            try {
                shipmentService.createShipment(savedOrder);
                log.info("Shipment record created successfully.");
            } catch (Exception e) {
                log.error("Failed to create shipment record (non-blocking): {}", e.getMessage());
            }

        } catch (Exception e) {
            log.error("High-fidelity post-verification cycle encountered an interference: {}", e.getMessage());
            e.printStackTrace();
            // We don't rethrow here to prevent rolling back a successful payment verification
        }

        payment.setOrder(savedOrder);

        paymentRepository.save(payment);

        // 7. Clear cart
        log.info("Clearing cart for user: {}", user.getEmail());
        cartService.clearCart(user.getEmail());

        return true;
    }
}

