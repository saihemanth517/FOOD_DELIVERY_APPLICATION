package com.fooddelivery.service;

import com.fooddelivery.dto.MenuItemResponseDTO;
import com.fooddelivery.dto.MenuItemSearchRequestDTO;
import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.repo.MenuItemRepository;
import com.fooddelivery.repo.RestaurantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MenuService {
    
    private static final Logger log = LoggerFactory.getLogger(MenuService.class);
    
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    
    public MenuService(MenuItemRepository menuItemRepository, RestaurantRepository restaurantRepository) {
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
    }
    
    public List<MenuItemResponseDTO> getMenuItemsByRestaurant(Long restaurantId) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        
        Optional<Restaurant> restaurant = restaurantRepository.findById(restaurantId);
        if (restaurant.isEmpty()) {
            throw new IllegalArgumentException("Restaurant not found with id: " + restaurantId);
        }
        
        List<MenuItem> menuItems = menuItemRepository.findByRestaurantAndIsAvailableTrue(restaurant.get());
        return menuItems.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public Page<MenuItemResponseDTO> searchMenuItems(MenuItemSearchRequestDTO searchRequest) {
        if (searchRequest == null || searchRequest.getRestaurantId() == null) {
            throw new IllegalArgumentException("Restaurant ID is required for menu search");
        }
        
        Optional<Restaurant> restaurant = restaurantRepository.findById(searchRequest.getRestaurantId());
        if (restaurant.isEmpty()) {
            throw new IllegalArgumentException("Restaurant not found with id: " + searchRequest.getRestaurantId());
        }
        
        Sort sort = createSort(searchRequest.getSortBy(), searchRequest.getSortDirection());
        Pageable pageable = PageRequest.of(searchRequest.getPage(), searchRequest.getSize(), sort);
        
        Page<MenuItem> menuItems = menuItemRepository.findMenuItemsByCriteria(
            restaurant.get(),
            searchRequest.getCategory(),
            searchRequest.getIsVegetarian(),
            searchRequest.getIsVegan(),
            searchRequest.getMinPrice(),
            searchRequest.getMaxPrice(),
            searchRequest.getSearchTerm(),
            pageable
        );
        
        return menuItems.map(this::convertToResponseDTO);
    }
    
    public Optional<MenuItemResponseDTO> getMenuItemById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        
        Optional<MenuItem> menuItem = menuItemRepository.findById(id);
        return menuItem.map(this::convertToResponseDTO);
    }
    
    public List<MenuItemResponseDTO> getMenuItemsByCategory(Long restaurantId, String category) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be null or empty");
        }
        
        Optional<Restaurant> restaurant = restaurantRepository.findById(restaurantId);
        if (restaurant.isEmpty()) {
            throw new IllegalArgumentException("Restaurant not found with id: " + restaurantId);
        }
        
        List<MenuItem> menuItems = menuItemRepository.findByRestaurantAndCategoryAndIsAvailableTrue(
            restaurant.get(), category);
        return menuItems.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public List<MenuItemResponseDTO> getVegetarianMenuItems(Long restaurantId) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        
        Optional<Restaurant> restaurant = restaurantRepository.findById(restaurantId);
        if (restaurant.isEmpty()) {
            throw new IllegalArgumentException("Restaurant not found with id: " + restaurantId);
        }
        
        List<MenuItem> menuItems = menuItemRepository.findByRestaurantAndIsAvailableTrue(restaurant.get())
                .stream()
                .filter(MenuItem::getIsVegetarian)
                .collect(Collectors.toList());
        
        return menuItems.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public List<MenuItemResponseDTO> getTopRatedMenuItems(Long restaurantId, int limit) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        if (limit <= 0) {
            throw new IllegalArgumentException("Limit must be positive");
        }
        
        Optional<Restaurant> restaurant = restaurantRepository.findById(restaurantId);
        if (restaurant.isEmpty()) {
            throw new IllegalArgumentException("Restaurant not found with id: " + restaurantId);
        }
        
        Pageable pageable = PageRequest.of(0, limit);
        List<MenuItem> menuItems = menuItemRepository.findTopRatedMenuItemsByRestaurant(restaurant.get(), pageable);
        return menuItems.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public List<String> getCategoriesByRestaurant(Long restaurantId) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        
        Optional<Restaurant> restaurant = restaurantRepository.findById(restaurantId);
        if (restaurant.isEmpty()) {
            throw new IllegalArgumentException("Restaurant not found with id: " + restaurantId);
        }
        
        return menuItemRepository.findDistinctCategoriesByRestaurant(restaurant.get());
    }
    
    public List<MenuItemResponseDTO> searchMenuItemsByName(Long restaurantId, String name) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Search name cannot be null or empty");
        }
        
        Optional<Restaurant> restaurant = restaurantRepository.findById(restaurantId);
        if (restaurant.isEmpty()) {
            throw new IllegalArgumentException("Restaurant not found with id: " + restaurantId);
        }
        
        List<MenuItem> menuItems = menuItemRepository.findByRestaurantAndNameContainingIgnoreCaseAndIsAvailableTrue(
            restaurant.get(), name);
        return menuItems.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    private MenuItemResponseDTO convertToResponseDTO(MenuItem menuItem) {
        MenuItemResponseDTO dto = new MenuItemResponseDTO();
        dto.setId(menuItem.getId());
        dto.setName(menuItem.getName());
        dto.setDescription(menuItem.getDescription());
        // dto.setPrice(menuItem.getPrice());
        dto.setImageUrl(menuItem.getImageUrl());
        dto.setIsAvailable(menuItem.getIsAvailable());
        dto.setIsVegetarian(menuItem.getIsVegetarian());
        dto.setIsVegan(menuItem.getIsVegan());
        // dto.setSpiceLevel(menuItem.getSpiceLevel());
        dto.setPrepTime(menuItem.getPrepTime());
        dto.setCategory(menuItem.getCategory());
        dto.setCalories(menuItem.getCalories());
        dto.setRating(menuItem.getRating());
        dto.setTotalReviews(menuItem.getTotalReviews());
        dto.setCreatedAt(menuItem.getCreatedAt());
        dto.setUpdatedAt(menuItem.getUpdatedAt());
        
        if (menuItem.getRestaurant() != null) {
            dto.setRestaurantId(menuItem.getRestaurant().getId());
            dto.setRestaurantName(menuItem.getRestaurant().getName());
        }
        
        return dto;
    }
    
    private Sort createSort(String sortBy, String sortDirection) {
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        
        String sortField = switch (sortBy != null ? sortBy.toLowerCase() : "name") {
            case "price" -> "price";
            case "rating" -> "rating";
            case "name" -> "name";
            case "preptime" -> "prepTime";
            default -> "name";
        };
        
        return Sort.by(direction, sortField);
    }
}