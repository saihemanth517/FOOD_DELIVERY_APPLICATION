package com.fooddelivery.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CartItemResponseDTO {
    private Long id;
    private Integer quantity;
    private Double price;
    private String specialInstructions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Menu item info
    private Long menuItemId;
    private String menuItemName;
    private String menuItemDescription;
    private String menuItemImageUrl;
    private Boolean isVegetarian;
    private Boolean isVegan;
    private String spiceLevel;
    private String category;
    
    // Calculated fields
    private Double totalPrice;
}
