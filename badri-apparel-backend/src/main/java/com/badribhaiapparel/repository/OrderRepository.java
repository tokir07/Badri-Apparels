package com.badribhaiapparel.repository;

import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.entity.OrderStatus;
import com.badribhaiapparel.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    java.util.Optional<Order> findByOrderNumber(String orderNumber);
    long countByOrderStatus(OrderStatus orderStatus);
    
    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderStatus != com.badribhaiapparel.entity.OrderStatus.CANCELLED")
    Double sumTotalAmount();

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderStatus != com.badribhaiapparel.entity.OrderStatus.CANCELLED AND o.createdAt BETWEEN :start AND :end")
    Double sumTotalAmountByCreatedAtBetween(@org.springframework.data.repository.query.Param("start") java.time.LocalDateTime start, @org.springframework.data.repository.query.Param("end") java.time.LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT o FROM Order o JOIN FETCH o.user ORDER BY o.createdAt DESC")
    List<Order> findTop10WithUserOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT new com.badribhaiapparel.dto.DailyRevenueDTO(CAST(o.createdAt AS date), SUM(o.totalAmount), COUNT(o)) " +
           "FROM Order o WHERE o.createdAt >= :startDate AND o.orderStatus != com.badribhaiapparel.entity.OrderStatus.CANCELLED GROUP BY CAST(o.createdAt AS date) ORDER BY CAST(o.createdAt AS date) ASC")
    List<com.badribhaiapparel.dto.DailyRevenueDTO> getDailyRevenueFrom(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate);

    @org.springframework.data.jpa.repository.Query(value = """
      SELECT p.id, p.title, SUM(oi.quantity) as units_sold, SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.created_at >= :since
        AND o.order_status NOT IN ('CANCELLED')
      GROUP BY p.id, p.title
      ORDER BY revenue DESC LIMIT 5
    """, nativeQuery = true)
    List<Object[]> getTopProducts(@org.springframework.data.repository.query.Param("since") java.time.LocalDateTime since);

    @org.springframework.data.jpa.repository.Query(value = """
      SELECT c.name, SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.created_at >= :since
        AND o.order_status NOT IN ('CANCELLED')
      GROUP BY c.name
      ORDER BY revenue DESC
    """, nativeQuery = true)
    List<Object[]> getRevenueByCategory(@org.springframework.data.repository.query.Param("since") java.time.LocalDateTime since);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :since AND u.role = 'CUSTOMER'")
    int countNewCustomersSince(@org.springframework.data.repository.query.Param("since") java.time.LocalDateTime since);

    List<Order> findAllByOrderByCreatedAtDesc();
}
