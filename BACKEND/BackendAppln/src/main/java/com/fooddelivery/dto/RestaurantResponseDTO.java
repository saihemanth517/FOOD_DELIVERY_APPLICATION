package com.fooddelivery.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class RestaurantResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String email;
    private String cuisineType;
    private String imageUrl;
    private Boolean isActive;
    private Double deliveryFee;
    private Double minOrderAmount;
    private Integer avgDeliveryTime;
    private Double rating;
    private Integer totalReviews;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Optional: Include menu items count
    private Integer menuItemsCount;
    
    // Optional: Include recent reviews
    private List<ReviewResponseDTO> recentReviews;
}
