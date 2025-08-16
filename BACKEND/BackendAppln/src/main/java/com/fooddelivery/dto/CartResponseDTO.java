package com.fooddelivery.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CartResponseDTO {
    private Long id;
    private Double totalAmount;
    private Integer totalItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Restaurant info
    private Long restaurantId;
    private String restaurantName;
    private String restaurantImageUrl;
    private Double deliveryFee;
    private Double minOrderAmount;
    
    // Cart items
    private List<CartItemResponseDTO> cartItems;
    
    // Calculated fields
    private Double subtotal;
    private Double taxAmount;
    private Double grandTotal;
}
