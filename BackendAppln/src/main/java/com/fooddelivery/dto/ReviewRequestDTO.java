package com.fooddelivery.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewRequestDTO {
    
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;
    
    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String comment;
    
    @NotNull(message = "Review type is required")
    private String reviewType; // RESTAURANT, DELIVERY_PARTNER, ORDER
    
    @Min(value = 1, message = "Food rating must be at least 1")
    @Max(value = 5, message = "Food rating cannot exceed 5")
    private Integer foodRating;
    
    @Min(value = 1, message = "Delivery rating must be at least 1")
    @Max(value = 5, message = "Delivery rating cannot exceed 5")
    private Integer deliveryRating;
    
    @Min(value = 1, message = "Service rating must be at least 1")
    @Max(value = 5, message = "Service rating cannot exceed 5")
    private Integer serviceRating;
    
    private Boolean isAnonymous = false;
}
