package com.badribhaiapparel.event;

import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.entity.OrderStatus;
import lombok.Getter;

@Getter
public class OrderStatusChangedEvent {
    private final Order order;
    private final OrderStatus newStatus;
    private final String reason;

    public OrderStatusChangedEvent(Order order, OrderStatus newStatus) {
        this(order, newStatus, null);
    }

    public OrderStatusChangedEvent(Order order, OrderStatus newStatus, String reason) {
        this.order = order;
        this.newStatus = newStatus;
        this.reason = reason;
    }
}
