package com.badribhaiapparel.dto;

import java.util.List;

public class DashboardStatsDTO {
    private Double totalRevenue;
    private Long totalOrders;
    private Long totalCustomers;
    private Long pendingOrders;
    private Long processingOrders;
    private Long shippedOrders;
    private Long deliveredOrders;
    private List<RecentOrderDTO> recentOrders;
    private List<LowStockProductDTO> lowStockProducts;
    private List<Double> last7DaysRevenue;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(Double totalRevenue, Long totalOrders, Long totalCustomers, Long pendingOrders, 
                            Long processingOrders, Long shippedOrders, Long deliveredOrders, 
                            List<RecentOrderDTO> recentOrders, List<LowStockProductDTO> lowStockProducts,
                            List<Double> last7DaysRevenue) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.totalCustomers = totalCustomers;
        this.pendingOrders = pendingOrders;
        this.processingOrders = processingOrders;
        this.shippedOrders = shippedOrders;
        this.deliveredOrders = deliveredOrders;
        this.recentOrders = recentOrders;
        this.lowStockProducts = lowStockProducts;
        this.last7DaysRevenue = last7DaysRevenue;
    }

    // Getters and Setters
    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }
    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }
    public Long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(Long pendingOrders) { this.pendingOrders = pendingOrders; }
    public Long getProcessingOrders() { return processingOrders; }
    public void setProcessingOrders(Long processingOrders) { this.processingOrders = processingOrders; }
    public Long getShippedOrders() { return shippedOrders; }
    public void setShippedOrders(Long shippedOrders) { this.shippedOrders = shippedOrders; }
    public Long getDeliveredOrders() { return deliveredOrders; }
    public void setDeliveredOrders(Long deliveredOrders) { this.deliveredOrders = deliveredOrders; }
    public List<RecentOrderDTO> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<RecentOrderDTO> recentOrders) { this.recentOrders = recentOrders; }
    public List<LowStockProductDTO> getLowStockProducts() { return lowStockProducts; }
    public void setLowStockProducts(List<LowStockProductDTO> lowStockProducts) { this.lowStockProducts = lowStockProducts; }
    public List<Double> getLast7DaysRevenue() { return last7DaysRevenue; }
    public void setLast7DaysRevenue(List<Double> last7DaysRevenue) { this.last7DaysRevenue = last7DaysRevenue; }

    public static DashboardStatsDTOBuilder builder() { return new DashboardStatsDTOBuilder(); }

    public static class DashboardStatsDTOBuilder {
        private Double totalRevenue;
        private Long totalOrders;
        private Long totalCustomers;
        private Long pendingOrders;
        private Long processingOrders;
        private Long shippedOrders;
        private Long deliveredOrders;
        private List<RecentOrderDTO> recentOrders;
        private List<LowStockProductDTO> lowStockProducts;
        private List<Double> last7DaysRevenue;

        public DashboardStatsDTOBuilder totalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public DashboardStatsDTOBuilder totalOrders(Long totalOrders) { this.totalOrders = totalOrders; return this; }
        public DashboardStatsDTOBuilder totalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; return this; }
        public DashboardStatsDTOBuilder pendingOrders(Long pendingOrders) { this.pendingOrders = pendingOrders; return this; }
        public DashboardStatsDTOBuilder processingOrders(Long processingOrders) { this.processingOrders = processingOrders; return this; }
        public DashboardStatsDTOBuilder shippedOrders(Long shippedOrders) { this.shippedOrders = shippedOrders; return this; }
        public DashboardStatsDTOBuilder deliveredOrders(Long deliveredOrders) { this.deliveredOrders = deliveredOrders; return this; }
        public DashboardStatsDTOBuilder recentOrders(List<RecentOrderDTO> recentOrders) { this.recentOrders = recentOrders; return this; }
        public DashboardStatsDTOBuilder lowStockProducts(List<LowStockProductDTO> lowStockProducts) { this.lowStockProducts = lowStockProducts; return this; }
        public DashboardStatsDTOBuilder last7DaysRevenue(List<Double> last7DaysRevenue) { this.last7DaysRevenue = last7DaysRevenue; return this; }

        public DashboardStatsDTO build() {
            return new DashboardStatsDTO(totalRevenue, totalOrders, totalCustomers, pendingOrders, 
                                       processingOrders, shippedOrders, deliveredOrders, recentOrders, lowStockProducts, last7DaysRevenue);
        }
    }

    public static class RecentOrderDTO {
        private String orderNumber;
        private String customerName;
        private Double amount;
        private String status;
        private String date;

        public RecentOrderDTO() {}
        public RecentOrderDTO(String orderNumber, String customerName, Double amount, String status, String date) {
            this.orderNumber = orderNumber;
            this.customerName = customerName;
            this.amount = amount;
            this.status = status;
            this.date = date;
        }

        public String getOrderNumber() { return orderNumber; }
        public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public static RecentOrderDTOBuilder builder() { return new RecentOrderDTOBuilder(); }

        public static class RecentOrderDTOBuilder {
            private String orderNumber;
            private String customerName;
            private Double amount;
            private String status;
            private String date;

            public RecentOrderDTOBuilder orderNumber(String orderNumber) { this.orderNumber = orderNumber; return this; }
            public RecentOrderDTOBuilder customerName(String customerName) { this.customerName = customerName; return this; }
            public RecentOrderDTOBuilder amount(Double amount) { this.amount = amount; return this; }
            public RecentOrderDTOBuilder status(String status) { this.status = status; return this; }
            public RecentOrderDTOBuilder date(String date) { this.date = date; return this; }

            public RecentOrderDTO build() {
                return new RecentOrderDTO(orderNumber, customerName, amount, status, date);
            }
        }
    }

    public static class LowStockProductDTO {
        private Long id;
        private String title;
        private Integer stock;
        private String imageUrl;

        public LowStockProductDTO() {}
        public LowStockProductDTO(Long id, String title, Integer stock, String imageUrl) {
            this.id = id;
            this.title = title;
            this.stock = stock;
            this.imageUrl = imageUrl;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public Integer getStock() { return stock; }
        public void setStock(Integer stock) { this.stock = stock; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public static LowStockProductDTOBuilder builder() { return new LowStockProductDTOBuilder(); }

        public static class LowStockProductDTOBuilder {
            private Long id;
            private String title;
            private Integer stock;
            private String imageUrl;

            public LowStockProductDTOBuilder id(Long id) { this.id = id; return this; }
            public LowStockProductDTOBuilder title(String title) { this.title = title; return this; }
            public LowStockProductDTOBuilder stock(Integer stock) { this.stock = stock; return this; }
            public LowStockProductDTOBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }

            public LowStockProductDTO build() {
                return new LowStockProductDTO(id, title, stock, imageUrl);
            }
        }
    }
}
