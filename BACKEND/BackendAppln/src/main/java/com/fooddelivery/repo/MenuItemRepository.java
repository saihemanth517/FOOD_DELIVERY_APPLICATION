package com.fooddelivery.repo;

import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    // Basic queries
    List<MenuItem> findByRestaurantId(Long restaurantId);
    List<MenuItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);
    List<MenuItem> findByRestaurantIdAndCategoryAndIsAvailableTrue(Long restaurantId, String category);
    List<MenuItem> findByRestaurantIdAndNameContainingIgnoreCaseAndIsAvailableTrue(Long restaurantId, String name);
    
    // Custom queries for complex filtering
    @Query("SELECT m FROM MenuItem m WHERE m.restaurant = :restaurant AND m.isAvailable = true")
    List<MenuItem> findByRestaurantAndIsAvailableTrue(@Param("restaurant") Restaurant restaurant);
    
    @Query("SELECT m FROM MenuItem m WHERE m.restaurant = :restaurant AND m.category = :category AND m.isAvailable = true")
    List<MenuItem> findByRestaurantAndCategoryAndIsAvailableTrue(@Param("restaurant") Restaurant restaurant, @Param("category") String category);
    
    @Query("SELECT m FROM MenuItem m WHERE m.restaurant = :restaurant AND m.name LIKE %:name% AND m.isAvailable = true")
    List<MenuItem> findByRestaurantAndNameContainingIgnoreCaseAndIsAvailableTrue(@Param("restaurant") Restaurant restaurant, @Param("name") String name);
    
    @Query("SELECT DISTINCT m.category FROM MenuItem m WHERE m.restaurant = :restaurant")
    List<String> findDistinctCategoriesByRestaurant(@Param("restaurant") Restaurant restaurant);
    
    @Query("SELECT m FROM MenuItem m WHERE m.restaurant = :restaurant AND m.isAvailable = true ORDER BY m.rating DESC")
    List<MenuItem> findTopRatedMenuItemsByRestaurant(@Param("restaurant") Restaurant restaurant, Pageable pageable);
    
    // Complex search with criteria
    @Query("SELECT m FROM MenuItem m WHERE m.restaurant = :restaurant " +
           "AND (:category IS NULL OR m.category = :category) " +
           "AND (:isVegetarian IS NULL OR m.isVegetarian = :isVegetarian) " +
           "AND (:isVegan IS NULL OR m.isVegan = :isVegan) " +
           "AND (:minPrice IS NULL OR m.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR m.price <= :maxPrice) " +
           "AND (:searchTerm IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(m.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND m.isAvailable = true")
    Page<MenuItem> findMenuItemsByCriteria(
            @Param("restaurant") Restaurant restaurant,
            @Param("category") String category,
            @Param("isVegetarian") Boolean isVegetarian,
            @Param("isVegan") Boolean isVegan,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );
}
