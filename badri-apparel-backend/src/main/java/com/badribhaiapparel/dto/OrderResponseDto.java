package com.badribhaiapparel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private Long id;
    private String orderNumber;
    private UserResponseDto user;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String phoneNumber;
    private String paymentMethod;
    private String paymentStatus;
    private String orderStatus;
    private String transactionId;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;
}
