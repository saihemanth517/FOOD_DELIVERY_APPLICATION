package com.fooddelivery.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponseDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private String reviewType;
    private Integer foodRating;
    private Integer deliveryRating;
    private Integer serviceRating;
    private Boolean isAnonymous;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Customer info
    private Long customerId;
    private String customerName;
    
    // Restaurant info
    private Long restaurantId;
    private String restaurantName;
    
    // Order info
    private Long orderId;
    private String orderNumber;
    
    // Delivery partner info
    private Long deliveryPartnerId;
    private String deliveryPartnerName;
}
