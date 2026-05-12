package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayInputStream;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String adminEmail;

    @Override
    @Async
    public void sendOrderConfirmation(Order order, ByteArrayInputStream invoicePdf) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Your BadriBhai Apparel Masterpiece is Confirmed! - #" + order.getOrderNumber());

            Context context = new Context();
            context.setVariable("name", order.getUser().getFirstName());
            context.setVariable("orderNumber", order.getOrderNumber());
            context.setVariable("total", order.getTotalAmount());
            context.setVariable("items", order.getItems());

            String htmlContent = templateEngine.process("emails/order-confirmation", context);
            helper.setText(htmlContent, true);

            // Attach Invoice
            if (invoicePdf != null) {
                byte[] invoiceBytes = invoicePdf.readAllBytes();
                helper.addAttachment("Invoice-" + order.getOrderNumber() + ".pdf", new ByteArrayResource(invoiceBytes));
            }

            mailSender.send(message);
            logger.info("Order confirmation email sent successfully for order: {}", order.getOrderNumber());
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email for order: {}. Error: {}", order.getOrderNumber(), e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        sendHtmlEmail(toEmail, "Welcome to the BadriBhai Heritage!", "emails/welcome", Map.of("name", name));
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        sendHtmlEmail(toEmail, "Reset Your Password - BadriBhai Apparels", "emails/password-reset", Map.of("resetLink", resetLink));
    }

    @Override
    @Async
    public void sendShippingUpdate(Order order) {
        sendHtmlEmail(order.getUser().getEmail(), 
            "Your Order #" + order.getOrderNumber() + " is " + order.getOrderStatus(), 
            "emails/shipping-update", 
            Map.of("name", order.getUser().getFirstName(), "status", order.getOrderStatus(), "tracking", order.getTrackingNumber()));
    }

    @Override
    @Async
    public void sendAdminNewOrderNotification(Order order, ByteArrayInputStream invoicePdf) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(adminEmail);
            helper.setSubject("NEW ACQUISITION ALERT - Order #" + order.getOrderNumber());

            Context context = new Context();
            context.setVariable("customer", order.getUser().getFirstName() + " " + order.getUser().getLastName());
            context.setVariable("amount", order.getTotalAmount());
            context.setVariable("orderNumber", order.getOrderNumber());
            context.setVariable("items", order.getItems());

            String htmlContent = templateEngine.process("emails/admin-new-order", context);
            helper.setText(htmlContent, true);

            // Attach Invoice
            if (invoicePdf != null) {
                byte[] invoiceBytes = invoicePdf.readAllBytes();
                helper.addAttachment("Admin-Invoice-" + order.getOrderNumber() + ".pdf", new ByteArrayResource(invoiceBytes));
            }

            mailSender.send(message);
            logger.info("Admin notification sent for order: {}", order.getOrderNumber());
        } catch (Exception e) {
            logger.error("Failed to send admin notification for order: {}. Error: {}", order.getOrderNumber(), e.getMessage());
            e.printStackTrace();
        }
    }

    private void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);

            Context context = new Context();
            context.setVariables(variables);

            String htmlContent = templateEngine.process(templateName, context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Email sent successfully to: {} with subject: {}", to, subject);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}. Subject: {}. Error: {}", to, subject, e.getMessage());
            e.printStackTrace();
        }
    }
}
