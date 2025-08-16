package com.fooddelivery.dto;

import lombok.Data;

@Data
public class MenuItemSearchRequestDTO {
    private Long restaurantId;
    private String searchTerm;
    private String category;
    private Boolean isVegetarian;
    private Boolean isVegan;
    private Double minPrice;
    private Double maxPrice;
    private String spiceLevel;
    private String sortBy; // price, rating, name, prepTime
    private String sortDirection; // asc, desc
    private Integer page = 0;
    private Integer size = 20;
}
