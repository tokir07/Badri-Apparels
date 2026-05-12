package com.badribhaiapparel.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ShipmentRequest {
    private String carrier;
    private String awbCode;
    private String trackingUrl;
    private LocalDate estimatedDelivery;
}
