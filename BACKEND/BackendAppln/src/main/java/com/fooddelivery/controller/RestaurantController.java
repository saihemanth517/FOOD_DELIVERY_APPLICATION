package com.fooddelivery.controller;

import com.fooddelivery.model.Restaurant;
import com.fooddelivery.service.RestaurantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {
    
    private static final Logger logger = LoggerFactory.getLogger(RestaurantController.class);
    
    @Autowired
    private RestaurantService restaurantService;
    
    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        logger.info("Fetching all restaurants");
        return restaurantService.getAllRestaurants();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        logger.info("Fetching restaurant with id: {}", id);
        return restaurantService.getRestaurantById(id)
                .map(restaurant -> {
                    logger.info("Found restaurant: {}", restaurant.getName());
                    return ResponseEntity.ok(restaurant);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant) {
        logger.info("Creating new restaurant: {}", restaurant.getName());
        logger.debug("Restaurant details: {}", restaurant);
        Restaurant saved = restaurantService.saveRestaurant(restaurant);
        logger.info("Successfully created restaurant with id: {}", saved.getId());
        return saved;
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Long id, @RequestBody Restaurant restaurantDetails) {
        logger.info("Updating restaurant with id: {}", id);
        logger.debug("Update details: {}", restaurantDetails);
        Restaurant updated = restaurantService.updateRestaurant(id, restaurantDetails);
        logger.info("Successfully updated restaurant: {}", updated.getName());
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        logger.info("Deleting restaurant with id: {}", id);
        restaurantService.deleteRestaurant(id);
        logger.info("Successfully deleted restaurant with id: {}", id);
        return ResponseEntity.noContent().build();
    }
}
