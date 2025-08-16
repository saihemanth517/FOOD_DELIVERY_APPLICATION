package com.fooddelivery.repo;

import com.fooddelivery.model.Order;
import com.fooddelivery.model.OrderItem;
import com.fooddelivery.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Find order items by order
    List<OrderItem> findByOrder(Order order);
    
    // Find order items by menu item
    List<OrderItem> findByMenuItem(MenuItem menuItem);
    
    // Find order items by order ID
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId")
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);
    
    // Count order items by order
    Long countByOrder(Order order);
    
    // Get total quantity by order
    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.order = :order")
    Integer getTotalQuantityByOrder(@Param("order") Order order);
    
    // Get total amount by order
    @Query("SELECT COALESCE(SUM(oi.price * oi.quantity), 0.0) FROM OrderItem oi WHERE oi.order = :order")
    Double getTotalAmountByOrder(@Param("order") Order order);
    
    // Find most popular menu items (by quantity ordered)
    @Query("SELECT oi.menuItem, SUM(oi.quantity) as totalQuantity FROM OrderItem oi " +
           "GROUP BY oi.menuItem ORDER BY totalQuantity DESC")
    List<Object[]> findMostPopularMenuItems();
    
    // Find most popular menu items by restaurant
    @Query("SELECT oi.menuItem, SUM(oi.quantity) as totalQuantity FROM OrderItem oi " +
           "WHERE oi.menuItem.restaurant.id = :restaurantId " +
           "GROUP BY oi.menuItem ORDER BY totalQuantity DESC")
    List<Object[]> findMostPopularMenuItemsByRestaurant(@Param("restaurantId") Long restaurantId);
}
