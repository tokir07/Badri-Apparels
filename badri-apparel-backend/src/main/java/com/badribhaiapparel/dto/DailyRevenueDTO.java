package com.badribhaiapparel.dto;

import java.time.LocalDate;

public class DailyRevenueDTO {
    private LocalDate date;
    private Double revenue;

    private Long orders;

    public DailyRevenueDTO() {}

    public DailyRevenueDTO(LocalDate date, Double revenue, Long orders) {
        this.date = date;
        this.revenue = revenue;
        this.orders = orders;
    }

    public DailyRevenueDTO(java.sql.Date date, Double revenue, Long orders) {
        this.date = date.toLocalDate();
        this.revenue = revenue;
        this.orders = orders;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }
    public Long getOrders() { return orders; }
    public void setOrders(Long orders) { this.orders = orders; }
}
