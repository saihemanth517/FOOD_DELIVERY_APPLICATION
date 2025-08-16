package com.fooddelivery.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MenuItemResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private Boolean isAvailable;
    private Boolean isVegetarian;
    private Boolean isVegan;
    private String spiceLevel;
    private Integer prepTime;
    private String category;
    private Integer calories;
    private Double rating;
    private Integer totalReviews;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Restaurant info
    private Long restaurantId;
    private String restaurantName;
}
