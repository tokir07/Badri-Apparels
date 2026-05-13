package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.dto.DashboardStatsDTO;
import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.entity.OrderStatus;
import com.badribhaiapparel.entity.Role;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.repository.OrderRepository;
import com.badribhaiapparel.repository.ProductRepository;
import com.badribhaiapparel.repository.UserRepository;
import com.badribhaiapparel.service.AdminService;
import com.badribhaiapparel.service.EmailService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final com.badribhaiapparel.repository.ProductVariantRepository variantRepository;
    private final EmailService emailService;

    private final com.badribhaiapparel.mapper.OrderMapper orderMapper;
    private final com.badribhaiapparel.mapper.UserMapper userMapper;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    public AdminServiceImpl(OrderRepository orderRepository,
                            UserRepository userRepository,
                            ProductRepository productRepository,
                            com.badribhaiapparel.repository.ProductVariantRepository variantRepository,
                            EmailService emailService,
                            com.badribhaiapparel.mapper.OrderMapper orderMapper,
                            com.badribhaiapparel.mapper.UserMapper userMapper,
                            org.springframework.context.ApplicationEventPublisher eventPublisher) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.emailService = emailService;
        this.orderMapper = orderMapper;
        this.userMapper = userMapper;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public DashboardStatsDTO getDashboardStats() {
        Double totalRevenue = orderRepository.sumTotalAmount();
        long totalOrders = orderRepository.count();
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        
        long pending = orderRepository.countByOrderStatus(OrderStatus.PENDING);
        long processing = orderRepository.countByOrderStatus(OrderStatus.PROCESSING);
        long shipped = orderRepository.countByOrderStatus(OrderStatus.SHIPPED);
        long delivered = orderRepository.countByOrderStatus(OrderStatus.DELIVERED);

        List<Order> recentOrders = orderRepository.findTop10WithUserOrderByCreatedAtDesc(org.springframework.data.domain.PageRequest.of(0, 10));

        List<DashboardStatsDTO.RecentOrderDTO> recentOrderDTOs = recentOrders.stream().map(o -> 
            DashboardStatsDTO.RecentOrderDTO.builder()
                .orderNumber(o.getOrderNumber())
                .customerName(o.getUser().getFirstName() + " " + o.getUser().getLastName())
                .amount(o.getTotalAmount())
                .status(o.getOrderStatus().name())
                .date(o.getCreatedAt().toString())
                .build()
        ).collect(Collectors.toList());

        List<DashboardStatsDTO.LowStockProductDTO> lowStock = productRepository.findByStockLessThan(10).stream()
                .map(p -> DashboardStatsDTO.LowStockProductDTO.builder()
                        .id(p.getId())
                        .title(p.getTitle())
                        .stock(p.getStock())
                        .imageUrl(p.getImages().isEmpty() ? "" : p.getImages().get(0).getUrl())
                        .build())
                .collect(Collectors.toList());

        // Optimized single-query revenue aggregation
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7).withHour(0).withMinute(0).withSecond(0).withNano(0);
        List<com.badribhaiapparel.dto.DailyRevenueDTO> dailyRevenues = orderRepository.getDailyRevenueFrom(sevenDaysAgo);
        
        List<Double> last7DaysRevenue = new java.util.ArrayList<>(java.util.Collections.nCopies(7, 0.0));
        java.time.LocalDate today = java.time.LocalDate.now();
        for (com.badribhaiapparel.dto.DailyRevenueDTO dr : dailyRevenues) {
            long daysAgo = java.time.temporal.ChronoUnit.DAYS.between(dr.getDate(), today);
            if (daysAgo >= 0 && daysAgo < 7) {
                last7DaysRevenue.set(6 - (int)daysAgo, dr.getRevenue());
            }
        }

        return DashboardStatsDTO.builder()
                .totalRevenue(totalRevenue != null ? totalRevenue : 0.0)
                .totalOrders(totalOrders)
                .totalCustomers(totalCustomers)
                .pendingOrders(pending)
                .processingOrders(processing)
                .shippedOrders(shipped)
                .deliveredOrders(delivered)
                .recentOrders(recentOrderDTOs)
                .lowStockProducts(lowStock)
                .last7DaysRevenue(last7DaysRevenue)
                .build();
    }

    @Override
    public com.badribhaiapparel.dto.DashboardSummaryDTO getDashboardSummary(String range) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime startDate = getStartDate(range);

        // Core Stats
        // Core Stats
        Double todayRevVal = orderRepository.sumTotalAmountByCreatedAtBetween(todayStart, now);
        java.math.BigDecimal todayRevenue = java.math.BigDecimal.valueOf(todayRevVal != null ? todayRevVal : 0.0);
        int todayOrders = (int) orderRepository.countByOrderStatus(OrderStatus.PENDING); 
        int newCustomers = (int) orderRepository.countNewCustomersSince(todayStart);
        int pendingOrders = (int) orderRepository.countByOrderStatus(OrderStatus.PENDING);

        // Time Series
        List<com.badribhaiapparel.dto.DailyRevenueDTO> revenueTrend = orderRepository.getDailyRevenueFrom(startDate);

        // Top Products
        List<Object[]> topProdRaw = orderRepository.getTopProducts(startDate);
        List<com.badribhaiapparel.dto.DashboardSummaryDTO.TopProductDTO> topProducts = topProdRaw.stream().map(row -> {
            Number id = (Number) row[0];
            Number sold = (Number) row[2];
            Number rev = (Number) row[3];
            return com.badribhaiapparel.dto.DashboardSummaryDTO.TopProductDTO.builder()
                .productId(id != null ? id.longValue() : 0L)
                .title((String) row[1])
                .unitsSold(sold != null ? sold.longValue() : 0L)
                .revenue(java.math.BigDecimal.valueOf(rev != null ? rev.doubleValue() : 0.0))
                .build();
        }).collect(Collectors.toList());

        // Category Revenue
        List<Object[]> catRevRaw = orderRepository.getRevenueByCategory(startDate);
        List<com.badribhaiapparel.dto.DashboardSummaryDTO.CategoryRevenueDTO> revenueByCategory = catRevRaw.stream().map(row -> {
            Number rev = (Number) row[1];
            return com.badribhaiapparel.dto.DashboardSummaryDTO.CategoryRevenueDTO.builder()
                .categoryName((String) row[0])
                .revenue(java.math.BigDecimal.valueOf(rev != null ? rev.doubleValue() : 0.0))
                .build();
        }).collect(Collectors.toList());

        // Low Stock
        List<com.badribhaiapparel.dto.DashboardSummaryDTO.LowStockAlertDTO> lowStockAlerts = variantRepository.findLowStockVariants().stream()
            .map(v -> com.badribhaiapparel.dto.DashboardSummaryDTO.LowStockAlertDTO.builder()
                .productId(v.getProduct() != null ? v.getProduct().getId() : null)
                .variantId(v.getId())
                .sku(v.getSku())
                .title(v.getProduct() != null ? v.getProduct().getTitle() : "Unknown")
                .size(v.getSize())
                .color(v.getColor())
                .stock(v.getStock())
                .threshold(v.getLowStockThreshold())
                .build()
            ).limit(10).collect(Collectors.toList());

        // Recent Orders
        List<com.badribhaiapparel.dto.DashboardSummaryDTO.RecentOrderDTO> recentOrders = orderRepository.findTop10WithUserOrderByCreatedAtDesc(org.springframework.data.domain.PageRequest.of(0, 5))
            .stream().map(o -> com.badribhaiapparel.dto.DashboardSummaryDTO.RecentOrderDTO.builder()
                .orderId(o.getId())
                .orderNumber(o.getOrderNumber())
                .customerName((o.getUser() != null) ? (o.getUser().getFirstName() + " " + o.getUser().getLastName()) : "Anonymous")
                .total(java.math.BigDecimal.valueOf(o.getTotalAmount() != null ? o.getTotalAmount() : 0.0))
                .status(o.getOrderStatus() != null ? o.getOrderStatus().name() : "UNKNOWN")
                .createdAt(o.getCreatedAt())
                .build()
            ).collect(Collectors.toList());

        return com.badribhaiapparel.dto.DashboardSummaryDTO.builder()
            .todayRevenue(todayRevenue)
            .todayOrders(todayOrders)
            .newCustomersToday(newCustomers)
            .pendingOrders(pendingOrders)
            .revenueTrend(revenueTrend)
            .topProducts(topProducts)
            .revenueByCategory(revenueByCategory)
            .lowStockAlerts(lowStockAlerts)
            .recentOrders(recentOrders)
            .build();
    }

    @Override
    public java.util.List<com.badribhaiapparel.dto.OrderResponseDto> getAllOrders() {
        return orderMapper.toDtoList(orderRepository.findAllByOrderByCreatedAtDesc());
    }

    @Override
    @Transactional
    public com.badribhaiapparel.dto.OrderResponseDto updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setOrderStatus(status);
        Order savedOrder = orderRepository.save(order);
        
        // Trigger asynchronous email notification
        eventPublisher.publishEvent(new com.badribhaiapparel.event.OrderStatusChangedEvent(savedOrder, status));
        
        return orderMapper.toDto(savedOrder);
    }

    @Override
    public java.util.List<com.badribhaiapparel.dto.UserResponseDto> getAllUsers() {
        return userMapper.toDtoList(userRepository.findAll());
    }

    @Override
    @Transactional
    public com.badribhaiapparel.dto.UserResponseDto updateUserStatus(Long userId, boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(isActive);
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // If there are orders, we might want to prevent deletion or handle cascade
        // For simplicity now, just delete
        userRepository.delete(user);
    }

    private LocalDateTime getStartDate(String range) {
        if (range == null) return LocalDateTime.now().minusDays(30);
        
        return switch (range.toLowerCase()) {
            case "today" -> LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            case "7d" -> LocalDateTime.now().minusDays(7).withHour(0).withMinute(0).withSecond(0).withNano(0);
            case "month" -> LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
            default -> LocalDateTime.now().minusDays(30).withHour(0).withMinute(0).withSecond(0).withNano(0);
        };
    }
}
