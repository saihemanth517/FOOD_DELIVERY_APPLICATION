package com.fooddelivery.repo;

import com.fooddelivery.model.DeliveryStatus;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryStatusRepository extends JpaRepository<DeliveryStatus, Long> {
    
    // Find delivery status by order
    List<DeliveryStatus> findByOrderOrderByCreatedAtDesc(Order order);
    
    // Find delivery status by order and status
    Optional<DeliveryStatus> findByOrderAndStatus(Order order, DeliveryStatus.Status status);
    
    // Find delivery status by delivery partner
    List<DeliveryStatus> findByDeliveryPartnerOrderByCreatedAtDesc(User deliveryPartner);
    
    // Find latest delivery status by order
    @Query("SELECT ds FROM DeliveryStatus ds WHERE ds.order = :order ORDER BY ds.createdAt DESC")
    Optional<DeliveryStatus> findLatestByOrder(@Param("order") Order order);
    
    // Find delivery status by order ID
    @Query("SELECT ds FROM DeliveryStatus ds WHERE ds.order.id = :orderId ORDER BY ds.createdAt DESC")
    List<DeliveryStatus> findByOrderIdOrderByCreatedAtDesc(@Param("orderId") Long orderId);
    
    // Check if order has specific status
    boolean existsByOrderAndStatus(Order order, DeliveryStatus.Status status);
    
    // Count delivery status updates by order
    Long countByOrder(Order order);
    
    // Find all delivery status updates for orders by customer
    @Query("SELECT ds FROM DeliveryStatus ds WHERE ds.order.customer = :customer ORDER BY ds.createdAt DESC")
    List<DeliveryStatus> findByCustomerOrderByCreatedAtDesc(@Param("customer") User customer);
}
