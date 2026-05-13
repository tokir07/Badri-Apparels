package com.badribhaiapparel.event;

import com.badribhaiapparel.entity.Order;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class OrderConfirmedEvent extends ApplicationEvent {
    private final Order order;

    public OrderConfirmedEvent(Order order) {
        super(order);
        this.order = order;
    }
}
