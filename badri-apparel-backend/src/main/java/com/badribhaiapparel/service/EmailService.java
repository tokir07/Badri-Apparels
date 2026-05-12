package com.badribhaiapparel.service;

import com.badribhaiapparel.entity.Order;
import java.io.ByteArrayInputStream;

public interface EmailService {
    void sendOrderConfirmation(Order order, ByteArrayInputStream invoicePdf);
    void sendWelcomeEmail(String toEmail, String name);
    void sendPasswordResetEmail(String toEmail, String resetLink);
    void sendShippingUpdate(Order order);
    void sendAdminNewOrderNotification(Order order, ByteArrayInputStream invoicePdf);
}
