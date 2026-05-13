package com.badribhaiapparel.service;

import com.badribhaiapparel.entity.Order;

public interface EmailService {
    void sendOrderConfirmation(Order order);
    void sendOrderConfirmation(Order order, java.io.ByteArrayInputStream invoiceStream);
    void sendShippingUpdate(Order order);
    void sendDeliveryConfirmation(Order order);
    void sendOrderCancellation(Order order, String reason);
    void sendAdminNewOrderNotification(Order order, java.io.ByteArrayInputStream invoiceStream);
}
