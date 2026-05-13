package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.dto.ShipmentDTO;
import com.badribhaiapparel.dto.ShipmentRequest;
import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.entity.OrderStatus;
import com.badribhaiapparel.entity.Shipment;
import com.badribhaiapparel.repository.OrderRepository;
import com.badribhaiapparel.repository.ShipmentRepository;
import com.badribhaiapparel.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public ShipmentDTO updateShipment(Long orderId, ShipmentRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Shipment shipment = shipmentRepository.findByOrderId(orderId)
                .orElse(new Shipment());

        shipment.setOrder(order);
        shipment.setCarrier(request.getCarrier());
        shipment.setAwbCode(request.getAwbCode());
        shipment.setTrackingUrl(request.getTrackingUrl());
        shipment.setEstimatedDelivery(request.getEstimatedDelivery());
        
        if (shipment.getShippedAt() == null) {
            shipment.setShippedAt(LocalDateTime.now());
            shipment.setStatus("SHIPPED");
        }

        shipmentRepository.save(shipment);

        // Update Order Status
        order.setOrderStatus(OrderStatus.SHIPPED);
        order.setShippedDate(LocalDateTime.now());
        orderRepository.save(order);

        return mapToDTO(shipment);
    }

    @Override
    @Transactional(readOnly = true)
    public ShipmentDTO getTracking(Long orderId) {
        Shipment shipment = shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Tracking info not found for this order"));
        
        return mapToDTO(shipment);
    }

    @Override
    @Transactional
    public void createShipment(Order order) {
        if (shipmentRepository.findByOrderId(order.getId()).isPresent()) {
            return; // Already exists
        }

        Shipment shipment = new Shipment();
        shipment.setOrder(order);
        shipment.setStatus("PENDING");
        shipmentRepository.save(shipment);
    }

    private ShipmentDTO mapToDTO(Shipment shipment) {
        return ShipmentDTO.builder()
                .id(shipment.getId())
                .orderId(shipment.getOrder().getId())
                .carrier(shipment.getCarrier())
                .awbCode(shipment.getAwbCode())
                .trackingUrl(shipment.getTrackingUrl())
                .status(shipment.getStatus())
                .shippedAt(shipment.getShippedAt())
                .estimatedDelivery(shipment.getEstimatedDelivery())
                .deliveredAt(shipment.getDeliveredAt())
                .build();
    }
}
