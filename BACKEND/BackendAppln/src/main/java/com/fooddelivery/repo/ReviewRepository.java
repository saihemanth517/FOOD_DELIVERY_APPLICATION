package com.fooddelivery.repo;

import com.fooddelivery.model.Review;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Find reviews by restaurant
    List<Review> findByRestaurantOrderByCreatedAtDesc(Restaurant restaurant);
    
    // Find reviews by restaurant with pagination
    Page<Review> findByRestaurantOrderByCreatedAtDesc(Restaurant restaurant, Pageable pageable);
    
    // Find reviews by customer
    List<Review> findByCustomerOrderByCreatedAtDesc(User customer);
    
    // Find reviews by order
    List<Review> findByOrder(Order order);
    
    // Find review by customer and order
    Optional<Review> findByCustomerAndOrder(User customer, Order order);
    
    // Find reviews by delivery partner
    List<Review> findByDeliveryPartnerOrderByCreatedAtDesc(User deliveryPartner);
    
    // Find reviews by review type
    List<Review> findByReviewTypeOrderByCreatedAtDesc(Review.ReviewType reviewType);
    
    // Find reviews by restaurant and rating
    List<Review> findByRestaurantAndRatingOrderByCreatedAtDesc(Restaurant restaurant, Integer rating);
    
    // Find reviews with rating above threshold
    List<Review> findByRatingGreaterThanEqualOrderByCreatedAtDesc(Integer rating);
    
    // Check if customer has reviewed an order
    boolean existsByCustomerAndOrder(User customer, Order order);
    
    // Get average rating for restaurant
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.restaurant = :restaurant")
    Double getAverageRatingByRestaurant(@Param("restaurant") Restaurant restaurant);
    
    // Get average rating for delivery partner
    @Query("SELECT AVG(r.deliveryRating) FROM Review r WHERE r.deliveryPartner = :deliveryPartner AND r.deliveryRating IS NOT NULL")
    Double getAverageDeliveryRatingByPartner(@Param("deliveryPartner") User deliveryPartner);
    
    // Count reviews by restaurant
    Long countByRestaurant(Restaurant restaurant);
    
    // Count reviews by delivery partner
    Long countByDeliveryPartner(User deliveryPartner);
    
    // Get rating distribution for restaurant
    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.restaurant = :restaurant GROUP BY r.rating ORDER BY r.rating DESC")
    List<Object[]> getRatingDistributionByRestaurant(@Param("restaurant") Restaurant restaurant);
    
    // Find recent reviews by restaurant (last 30 days)
    @Query("SELECT r FROM Review r WHERE r.restaurant = :restaurant AND r.createdAt >= :thirtyDaysAgo ORDER BY r.createdAt DESC")
    List<Review> findRecentReviewsByRestaurant(@Param("restaurant") Restaurant restaurant, @Param("thirtyDaysAgo") java.time.LocalDateTime thirtyDaysAgo);
    
    // Find top rated reviews by restaurant
    @Query("SELECT r FROM Review r WHERE r.restaurant = :restaurant AND r.rating >= 4 ORDER BY r.rating DESC, r.createdAt DESC")
    List<Review> findTopRatedReviewsByRestaurant(@Param("restaurant") Restaurant restaurant, Pageable pageable);
}
