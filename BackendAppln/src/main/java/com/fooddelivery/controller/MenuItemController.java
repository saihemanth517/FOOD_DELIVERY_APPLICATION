package com.fooddelivery.controller;

import com.fooddelivery.model.MenuItem;
import com.fooddelivery.service.MenuItemService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = "*")
public class MenuItemController {
    
    private static final Logger log = LoggerFactory.getLogger(MenuItemController.class);
    
    private final MenuItemService menuItemService;
    
    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }
    
    private Map<String, Object> createSuccessResponse(String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        if (data != null) {
            response.put("data", data);
        }
        return response;
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByRestaurant(@PathVariable Long restaurantId) {
        try {
            List<MenuItem> menuItems = menuItemService.getAllMenuItems(restaurantId);
            return ResponseEntity.ok(menuItems);
        } catch (Exception e) {
            log.error("Error fetching menu items for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/restaurant/{restaurantId}/category/{category}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByCategory(
            @PathVariable Long restaurantId, 
            @PathVariable String category) {
        try {
            List<MenuItem> menuItems = menuItemService.getMenuItemsByCategory(restaurantId, category);
            return ResponseEntity.ok(menuItems);
        } catch (Exception e) {
            log.error("Error fetching menu items by category for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/restaurant/{restaurantId}/search")
    public ResponseEntity<List<MenuItem>> searchMenuItems(
            @PathVariable Long restaurantId, 
            @RequestParam String keyword) {
        try {
            List<MenuItem> menuItems = menuItemService.searchMenuItems(restaurantId, keyword);
            return ResponseEntity.ok(menuItems);
        } catch (Exception e) {
            log.error("Error searching menu items for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/restaurant/{restaurantId}/available")
    public ResponseEntity<List<MenuItem>> getAvailableMenuItems(@PathVariable Long restaurantId) {
        try {
            List<MenuItem> menuItems = menuItemService.getAvailableMenuItems(restaurantId);
            return ResponseEntity.ok(menuItems);
        } catch (Exception e) {
            log.error("Error fetching available menu items for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        try {
            return menuItemService.getMenuItemById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error fetching menu item by id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/restaurant/{restaurantId}")
    public ResponseEntity<Map<String, Object>> createMenuItem(
            @PathVariable Long restaurantId, 
            @Valid @RequestBody MenuItem menuItem) {
        try {
            MenuItem savedMenuItem = menuItemService.saveMenuItem(restaurantId, menuItem);
            return ResponseEntity.ok(createSuccessResponse("Menu item created successfully", savedMenuItem));
        } catch (IllegalArgumentException e) {
            log.error("Invalid menu item data for restaurant {}: {}", restaurantId, e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating menu item for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to create menu item"));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateMenuItem(
            @PathVariable Long id, 
            @Valid @RequestBody MenuItem menuItemDetails) {
        try {
            MenuItem updatedMenuItem = menuItemService.updateMenuItem(id, menuItemDetails);
            return ResponseEntity.ok(createSuccessResponse("Menu item updated successfully", updatedMenuItem));
        } catch (IllegalArgumentException e) {
            log.error("Invalid menu item update data for id {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error updating menu item with id: {}", id, e);
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to update menu item"));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteMenuItem(@PathVariable Long id) {
        try {
            menuItemService.deleteMenuItem(id);
            return ResponseEntity.ok(createSuccessResponse("Menu item deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting menu item with id: {}", id, e);
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to delete menu item"));
        }
    }
}