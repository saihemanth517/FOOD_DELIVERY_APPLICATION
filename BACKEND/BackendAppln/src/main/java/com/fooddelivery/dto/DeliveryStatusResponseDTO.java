package com.fooddelivery.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DeliveryStatusResponseDTO {
    private Long id;
    private String status;
    private String description;
    private Double locationLatitude;
    private Double locationLongitude;
    private Integer estimatedTime;
    private LocalDateTime createdAt;
    
    // Order info
    private Long orderId;
    private String orderNumber;
    
    // Delivery partner info
    private Long deliveryPartnerId;
    private String deliveryPartnerName;
    private String deliveryPartnerPhone;
}
