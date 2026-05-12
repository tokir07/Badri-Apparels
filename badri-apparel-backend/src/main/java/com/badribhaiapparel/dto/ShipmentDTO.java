package com.badribhaiapparel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentDTO {
    private UUID id;
    private Long orderId;
    private String carrier;
    private String awbCode;
    private String trackingUrl;
    private String status;
    private LocalDateTime shippedAt;
    private LocalDate estimatedDelivery;
    private LocalDateTime deliveredAt;
}
