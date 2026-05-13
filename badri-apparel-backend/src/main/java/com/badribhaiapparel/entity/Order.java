package com.badribhaiapparel.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIncludeProperties({"id", "firstName", "lastName", "email"})
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

    private Double totalAmount;

    private String shippingAddress;

    private String paymentMethod;

    private String paymentStatus;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Payment payment;

    private String transactionId;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    private String orderNumber;
    private String phoneNumber;
    private String trackingNumber;
    private String courierName;
    private String shipmentId;
    private LocalDateTime expectedDeliveryDate;
    private LocalDateTime shippedDate;
    private LocalDateTime outForDeliveryDate;
    private LocalDateTime deliveredDate;
    private String trackingUrl;
    private String shipmentStatusMessage;
    private String couponCode;
    private Double discountAmount = 0.0;


}
