package com.fooddelivery.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDTO {
    private Long id;
    private String orderNumber;
    private String status;
    private Double subtotal;
    private Double deliveryFee;
    private Double taxAmount;
    private Double totalAmount;
    private String deliveryAddress;
    private String customerPhone;
    private String paymentMethod;
    private String paymentId;
    private String paymentStatus;
    private String specialInstructions;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Customer info
    private Long customerId;
    private String customerName;
    
    // Restaurant info
    private Long restaurantId;
    private String restaurantName;
    private String restaurantImageUrl;
    private String restaurantPhone;
    
    // Delivery partner info
    private Long deliveryPartnerId;
    private String deliveryPartnerName;
    private String deliveryPartnerPhone;
    
    // Order items
    private List<OrderItemResponseDTO> orderItems;
    
    // Delivery status updates
    private List<DeliveryStatusResponseDTO> deliveryStatusUpdates;
    
    // Review info
    private Boolean canReview;
    private Boolean hasReviewed;
}
