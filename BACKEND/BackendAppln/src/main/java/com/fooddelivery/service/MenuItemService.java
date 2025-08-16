package com.fooddelivery.service;

import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.repo.MenuItemRepository;
import com.fooddelivery.repo.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {

    private static final Logger log = LoggerFactory.getLogger(MenuItemService.class);

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;

    public MenuItemService(MenuItemRepository menuItemRepository, RestaurantRepository restaurantRepository) {
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public List<MenuItem> getAllMenuItems(Long restaurantId) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        log.info("Fetching all menu items for restaurantId: {}", restaurantId);
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    public List<MenuItem> getMenuItemsByCategory(Long restaurantId, String category) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be null or empty");
        }
        log.info("Fetching menu items for restaurantId: {} and category: {}", restaurantId, category);
        return menuItemRepository.findByRestaurantIdAndCategoryAndIsAvailableTrue(restaurantId, category);
    }
    
    public List<MenuItem> searchMenuItems(Long restaurantId, String keyword) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new IllegalArgumentException("Search keyword cannot be null or empty");
        }
        log.info("Searching menu items for restaurantId: {} with keyword: {}", restaurantId, keyword);
        return menuItemRepository.findByRestaurantIdAndNameContainingIgnoreCaseAndIsAvailableTrue(restaurantId, keyword);
    }

    public List<MenuItem> getAvailableMenuItems(Long restaurantId) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        log.info("Fetching available menu items for restaurantId: {}", restaurantId);
        return menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId);
    }

    public Optional<MenuItem> getMenuItemById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        log.info("Fetching menu item by id: {}", id);
        return menuItemRepository.findById(id);
    }

    @Transactional
    public MenuItem saveMenuItem(Long restaurantId, MenuItem menuItem) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        if (menuItem == null) {
            throw new IllegalArgumentException("Menu item cannot be null");
        }
        if (menuItem.getName() == null || menuItem.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Menu item name cannot be empty");
        }
        if (menuItem.getPrice() == null || menuItem.getPrice().doubleValue() < 0) {
            throw new IllegalArgumentException("Menu item price must be non-negative");
        }

        log.info("Saving new menu item for restaurantId: {}", restaurantId);
        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new IllegalArgumentException("Restaurant not found with id: " + restaurantId));

        menuItem.setRestaurant(restaurant);
        
        // Set default values if not provided
        if (menuItem.getIsAvailable() == null) {
            menuItem.setIsAvailable(true);
        }
        if (menuItem.getIsVegetarian() == null) {
            menuItem.setIsVegetarian(false);
        }
        if (menuItem.getIsVegan() == null) {
            menuItem.setIsVegan(false);
        }
        
        MenuItem savedItem = menuItemRepository.save(menuItem);
        log.info("Successfully saved menu item with id: {}", savedItem.getId());
        return savedItem;
    }

    @Transactional
    public MenuItem updateMenuItem(Long id, MenuItem menuItemDetails) {
        if (id == null) {
            throw new IllegalArgumentException("Menu item ID cannot be null");
        }
        if (menuItemDetails == null) {
            throw new IllegalArgumentException("Menu item details cannot be null");
        }
        if (menuItemDetails.getName() == null || menuItemDetails.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Menu item name cannot be empty");
        }
        if (menuItemDetails.getPrice() == null || menuItemDetails.getPrice().doubleValue() < 0) {
            throw new IllegalArgumentException("Menu item price must be non-negative");
        }

        log.info("Updating menu item with id: {}", id);
        MenuItem menuItem = menuItemRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Menu item not found with id: " + id));

        menuItem.setName(menuItemDetails.getName());
        menuItem.setPrice(menuItemDetails.getPrice());
        menuItem.setDescription(menuItemDetails.getDescription());
        menuItem.setCategory(menuItemDetails.getCategory());
        menuItem.setImageUrl(menuItemDetails.getImageUrl());
        
        if (menuItemDetails.getIsAvailable() != null) {
            menuItem.setIsAvailable(menuItemDetails.getIsAvailable());
        }
        if (menuItemDetails.getIsVegetarian() != null) {
            menuItem.setIsVegetarian(menuItemDetails.getIsVegetarian());
        }
        if (menuItemDetails.getIsVegan() != null) {
            menuItem.setIsVegan(menuItemDetails.getIsVegan());
        }
        if (menuItemDetails.getSpiceLevel() != null) {
            menuItem.setSpiceLevel(menuItemDetails.getSpiceLevel());
        }
        if (menuItemDetails.getPrepTime() != null) {
            menuItem.setPrepTime(menuItemDetails.getPrepTime());
        }
        if (menuItemDetails.getCalories() != null) {
            menuItem.setCalories(menuItemDetails.getCalories());
        }

        MenuItem updatedItem = menuItemRepository.save(menuItem);
        log.info("Successfully updated menu item with id: {}", updatedItem.getId());
        return updatedItem;
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Menu item ID cannot be null");
        }
        
        log.info("Deleting menu item with id: {}", id);
        
        if (!menuItemRepository.existsById(id)) {
            throw new IllegalArgumentException("Menu item not found with id: " + id);
        }
        
        menuItemRepository.deleteById(id);
        log.info("Successfully deleted menu item with id: {}", id);
    }
}