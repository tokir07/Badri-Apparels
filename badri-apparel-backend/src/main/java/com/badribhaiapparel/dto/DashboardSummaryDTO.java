package com.badribhaiapparel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private BigDecimal todayRevenue;
    private int todayOrders;
    private int newCustomersToday;
    private int pendingOrders;
    private List<DailyRevenueDTO> revenueTrend;
    private List<TopProductDTO> topProducts;
    private List<CategoryRevenueDTO> revenueByCategory;
    private List<LowStockAlertDTO> lowStockAlerts;
    private List<RecentOrderDTO> recentOrders;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProductDTO {
        private Long productId;
        private String title;
        private String imageUrl;
        private Long unitsSold;
        private BigDecimal revenue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryRevenueDTO {
        private String categoryName;
        private BigDecimal revenue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LowStockAlertDTO {
        private Long productId;
        private UUID variantId;
        private String sku;
        private String title;
        private String size;
        private String color;
        private int stock;
        private int threshold;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentOrderDTO {
        private Long orderId;
        private String orderNumber;
        private String customerName;
        private BigDecimal total;
        private String status;
        private LocalDateTime createdAt;
    }
}
