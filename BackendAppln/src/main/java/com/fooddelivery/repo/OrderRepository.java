package com.fooddelivery.repo;

import com.fooddelivery.model.Order;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find order by order number
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // Find orders by customer
    List<Order> findByCustomerOrderByCreatedAtDesc(User customer);
    
    // Find orders by customer with pagination
    Page<Order> findByCustomerOrderByCreatedAtDesc(User customer, Pageable pageable);
    
    // Find orders by restaurant
    List<Order> findByRestaurantOrderByCreatedAtDesc(Restaurant restaurant);
    
    // Find orders by restaurant with pagination
    Page<Order> findByRestaurantOrderByCreatedAtDesc(Restaurant restaurant, Pageable pageable);
    
    // Find orders by delivery partner
    List<Order> findByDeliveryPartnerOrderByCreatedAtDesc(User deliveryPartner);
    
    // Find orders by status
    List<Order> findByStatusOrderByCreatedAtDesc(Order.OrderStatus status);
    
    // Find orders by customer and status
    List<Order> findByCustomerAndStatusOrderByCreatedAtDesc(User customer, Order.OrderStatus status);
    
    // Find active orders by customer (not delivered or cancelled)
    @Query("SELECT o FROM Order o WHERE o.customer = :customer AND o.status NOT IN ('DELIVERED', 'CANCELLED') ORDER BY o.createdAt DESC")
    List<Order> findActiveOrdersByCustomer(@Param("customer") User customer);
    
    // Find orders by date range
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate ORDER BY o.createdAt DESC")
    List<Order> findOrdersByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find orders by customer and date range
    @Query("SELECT o FROM Order o WHERE o.customer = :customer AND o.createdAt BETWEEN :startDate AND :endDate ORDER BY o.createdAt DESC")
    List<Order> findOrdersByCustomerAndDateRange(@Param("customer") User customer, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find orders by restaurant and date range
    @Query("SELECT o FROM Order o WHERE o.restaurant = :restaurant AND o.createdAt BETWEEN :startDate AND :endDate ORDER BY o.createdAt DESC")
    List<Order> findOrdersByRestaurantAndDateRange(@Param("restaurant") Restaurant restaurant, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Count orders by customer
    Long countByCustomer(User customer);
    
    // Count orders by restaurant
    Long countByRestaurant(Restaurant restaurant);
    
    // Get total amount spent by customer
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.customer = :customer AND o.status = 'DELIVERED'")
    Double getTotalAmountSpentByCustomer(@Param("customer") User customer);
    
    // Get total revenue for restaurant
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.restaurant = :restaurant AND o.status = 'DELIVERED'")
    Double getTotalRevenueByRestaurant(@Param("restaurant") Restaurant restaurant);
    
    // Find orders available for delivery (confirmed and ready for pickup)
    @Query("SELECT o FROM Order o WHERE o.status IN ('CONFIRMED', 'READY_FOR_PICKUP') AND o.deliveryPartner IS NULL ORDER BY o.createdAt ASC")
    List<Order> findOrdersAvailableForDelivery();
    
    // Find recent orders by customer (last 30 days)
    @Query("SELECT o FROM Order o WHERE o.customer = :customer AND o.createdAt >= :thirtyDaysAgo ORDER BY o.createdAt DESC")
    List<Order> findRecentOrdersByCustomer(@Param("customer") User customer, @Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);
}
