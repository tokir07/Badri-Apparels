package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${store.support-email}")
    private String supportEmail;

    @Value("${store.frontend-url}")
    private String frontendUrl;

    public EmailServiceImpl(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    public void sendOrderConfirmation(Order order) {
        sendOrderConfirmation(order, null);
    }

    @Override
    public void sendOrderConfirmation(Order order, java.io.ByteArrayInputStream invoiceStream) {
        try {
            Context context = new Context();
            context.setVariable("customerName", order.getUser().getFirstName());
            context.setVariable("orderNumber", order.getOrderNumber());
            context.setVariable("orderDate", order.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
            context.setVariable("orderStatus", order.getOrderStatus().name());
            context.setVariable("totalAmount", "₹ " + String.format("%.2f", order.getTotalAmount()));
            context.setVariable("shippingAddress", order.getShippingAddress());
            context.setVariable("orderTrackingUrl", frontendUrl + "/account/orders/" + order.getId());
            context.setVariable("supportEmail", supportEmail);
            
            context.setVariable("items", order.getItems().stream().map(item -> new OrderItemView(
                    item.getProduct().getTitle(),
                    item.getQuantity(),
                    "₹ " + String.format("%.2f", item.getPrice()),
                    item.getSelectedSize(),
                    item.getSelectedColor()
            )).collect(Collectors.toList()));

            String htmlContent = templateEngine.process("email/order-confirmation", context);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("BadriBhai Apparels <" + fromEmail + ">");
            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Order Confirmed: " + order.getOrderNumber());
            helper.setText(htmlContent, true);
            
            // Attach Invoice
            if (invoiceStream != null) {
                byte[] bytes = invoiceStream.readAllBytes();
                helper.addAttachment("invoice-" + order.getOrderNumber() + ".pdf", 
                        new org.springframework.core.io.ByteArrayResource(bytes));
            }
            
            mailSender.send(message);
            log.info("Order confirmation with invoice sent for order: {}", order.getOrderNumber());
        } catch (Exception e) {
            log.error("Failed to send order confirmation email for order: {}", order.getOrderNumber(), e);
        }
    }

    @Override
    public void sendShippingUpdate(Order order) {
        try {
            Context context = new Context();
            context.setVariable("customerName", order.getUser().getFirstName());
            context.setVariable("orderNumber", order.getOrderNumber());
            context.setVariable("carrier", "Delhivery"); // Default for now
            context.setVariable("trackingNumber", order.getTrackingNumber() != null ? order.getTrackingNumber() : "Pending");
            context.setVariable("estimatedDelivery", "3-5 Business Days");
            context.setVariable("trackingUrl", frontendUrl + "/account/orders/" + order.getId());
            context.setVariable("supportEmail", supportEmail);

            String htmlContent = templateEngine.process("email/order-shipped", context);
            sendHtmlEmail(order.getUser().getEmail(), "Your BadriBhai Order has Shipped!", htmlContent);
        } catch (Exception e) {
            log.error("Failed to send shipping update email for order: {}", order.getOrderNumber(), e);
        }
    }

    @Override
    public void sendDeliveryConfirmation(Order order) {
        try {
            Context context = new Context();
            context.setVariable("customerName", order.getUser().getFirstName());
            context.setVariable("orderNumber", order.getOrderNumber());
            context.setVariable("reviewUrl", frontendUrl + "/account/orders/" + order.getId());

            String htmlContent = templateEngine.process("email/order-delivered", context);
            sendHtmlEmail(order.getUser().getEmail(), "Order Delivered: " + order.getOrderNumber(), htmlContent);
        } catch (Exception e) {
            log.error("Failed to send delivery confirmation email for order: {}", order.getOrderNumber(), e);
        }
    }

    @Override
    public void sendOrderCancellation(Order order, String reason) {
        try {
            Context context = new Context();
            context.setVariable("customerName", order.getUser().getFirstName());
            context.setVariable("orderNumber", order.getOrderNumber());
            context.setVariable("reason", reason);
            context.setVariable("paymentStatus", order.getPaymentStatus());
            context.setVariable("supportEmail", supportEmail);

            String htmlContent = templateEngine.process("email/order-cancelled", context);
            sendHtmlEmail(order.getUser().getEmail(), "Order Cancelled: " + order.getOrderNumber(), htmlContent);
        } catch (Exception e) {
            log.error("Failed to send cancellation email for order: {}", order.getOrderNumber(), e);
        }
    }

    @Override
    public void sendAdminNewOrderNotification(Order order, java.io.ByteArrayInputStream invoiceStream) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("BadriBhai Archive <" + fromEmail + ">");
            helper.setTo(supportEmail);
            helper.setSubject("URGENT: New Artisanal Acquisition - " + order.getOrderNumber());
            
            StringBuilder sb = new StringBuilder();
            sb.append("<h2>New Order Received</h2>");
            sb.append("<p>A new artisanal piece has been acquired by: <b>").append(order.getUser().getFirstName()).append(" ").append(order.getUser().getLastName()).append("</b></p>");
            sb.append("<p>Order Number: <b>").append(order.getOrderNumber()).append("</b></p>");
            sb.append("<p>Total Value: <b>₹ ").append(String.format("%.2f", order.getTotalAmount())).append("</b></p>");
            sb.append("<p>The heritage invoice is attached to this dispatch for your records.</p>");
            
            helper.setText(sb.toString(), true);
            
            // Attach Invoice
            byte[] bytes = invoiceStream.readAllBytes();
            helper.addAttachment("invoice-" + order.getOrderNumber() + ".pdf", new org.springframework.core.io.ByteArrayResource(bytes));
            
            mailSender.send(message);
            log.info("Admin notification for order {} dispatched successfully.", order.getOrderNumber());
        } catch (Exception e) {
            log.error("Failed to dispatch admin notification for order: {}", order.getOrderNumber(), e);
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("BadriBhai Apparels <" + fromEmail + ">");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    // Inner class for template mapping
    public record OrderItemView(String productName, int quantity, String price, String size, String color) {}
}
