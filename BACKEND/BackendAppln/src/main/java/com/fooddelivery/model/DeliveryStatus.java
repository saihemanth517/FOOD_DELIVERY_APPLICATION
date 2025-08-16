package com.fooddelivery.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_status")
@Data
public class DeliveryStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "location_latitude")
    private Double locationLatitude;
    
    @Column(name = "location_longitude")
    private Double locationLongitude;
    
    @Column(name = "estimated_time")
    private Integer estimatedTime; // in minutes
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Relationship with Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    // Relationship with User (Delivery Partner)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_partner_id")
    private User deliveryPartner;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum Status {
        ORDER_PLACED("Order has been placed"),
        ORDER_CONFIRMED("Order confirmed by restaurant"),
        PREPARING("Food is being prepared"),
        READY_FOR_PICKUP("Order is ready for pickup"),
        PICKED_UP("Order picked up by delivery partner"),
        OUT_FOR_DELIVERY("Order is out for delivery"),
        DELIVERED("Order has been delivered"),
        CANCELLED("Order has been cancelled");
        
        private final String description;
        
        Status(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
}
