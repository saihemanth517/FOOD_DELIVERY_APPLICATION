package com.fooddelivery.dto;

import lombok.Data;

@Data
public class RestaurantSearchRequestDTO {
    private String searchTerm;
    private String cuisineType;
    private Double minRating;
    private Double maxDeliveryFee;
    private Double maxMinOrderAmount;
    private String sortBy; // rating, deliveryTime, deliveryFee, name
    private String sortDirection; // asc, desc
    private Integer page = 0;
    private Integer size = 10;
}
