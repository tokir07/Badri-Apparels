package com.badribhaiapparel.event;

import com.badribhaiapparel.entity.OrderStatus;
import com.badribhaiapparel.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderEventListener {

    private final EmailService emailService;

    @Async
    @EventListener
    public void handleOrderConfirmed(OrderConfirmedEvent event) {
        emailService.sendOrderConfirmation(event.getOrder());
    }

    @Async
    @EventListener
    public void handleOrderStatusChanged(OrderStatusChangedEvent event) {
        OrderStatus status = event.getNewStatus();
        switch (status) {
            case SHIPPED -> emailService.sendShippingUpdate(event.getOrder());
            case DELIVERED -> emailService.sendDeliveryConfirmation(event.getOrder());
            case CANCELLED -> emailService.sendOrderCancellation(event.getOrder(), event.getReason());
            default -> {
                // No specific email for other statuses yet
            }
        }
    }
}
