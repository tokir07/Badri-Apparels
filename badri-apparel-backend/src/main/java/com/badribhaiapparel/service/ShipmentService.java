package com.badribhaiapparel.service;

import com.badribhaiapparel.dto.ShipmentDTO;
import com.badribhaiapparel.dto.ShipmentRequest;

public interface ShipmentService {
    ShipmentDTO updateShipment(Long orderId, ShipmentRequest request);
    ShipmentDTO getTracking(Long orderId);
    void createShipment(com.badribhaiapparel.entity.Order order);
}
