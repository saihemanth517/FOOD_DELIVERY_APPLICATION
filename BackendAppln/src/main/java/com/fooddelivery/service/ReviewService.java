package com.fooddelivery.service;

import com.fooddelivery.dto.ReviewRequestDTO;
import com.fooddelivery.dto.ReviewResponseDTO;
import com.fooddelivery.model.*;
import com.fooddelivery.repo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewService {
    
    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);
    
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    
    public ReviewService(ReviewRepository reviewRepository,
                        OrderRepository orderRepository,
                        UserRepository userRepository,
                        RestaurantRepository restaurantRepository) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }
    
    public ReviewResponseDTO createReview(String username, ReviewRequestDTO reviewRequest) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (reviewRequest == null) {
            throw new IllegalArgumentException("Review request cannot be null");
        }
        if (reviewRequest.getOrderId() == null) {
            throw new IllegalArgumentException("Order ID is required");
        }
        if (reviewRequest.getRating() == null || reviewRequest.getRating() < 1 || reviewRequest.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        
        User customer = getUserByUsername(username);
        Order order = orderRepository.findById(reviewRequest.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        
        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new IllegalArgumentException("Order does not belong to customer");
        }
        
        if (order.getStatus() != Order.OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Can only review delivered orders");
        }
        
        if (reviewRepository.existsByCustomerAndOrder(customer, order)) {
            throw new IllegalArgumentException("Order has already been reviewed");
        }
        
        Review review = new Review();
        review.setCustomer(customer);
        review.setOrder(order);
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());
        review.setReviewType(Review.ReviewType.valueOf(reviewRequest.getReviewType()));
        review.setFoodRating(reviewRequest.getFoodRating());
        review.setDeliveryRating(reviewRequest.getDeliveryRating());
        review.setServiceRating(reviewRequest.getServiceRating());
        review.setIsAnonymous(reviewRequest.getIsAnonymous() != null ? reviewRequest.getIsAnonymous() : false);
        
        if (review.getReviewType() == Review.ReviewType.RESTAURANT || 
            review.getReviewType() == Review.ReviewType.ORDER) {
            review.setRestaurant(order.getRestaurant());
        }
        
        if (review.getReviewType() == Review.ReviewType.DELIVERY_PARTNER && 
            order.getDeliveryPartner() != null) {
            review.setDeliveryPartner(order.getDeliveryPartner());
        }
        
        review = reviewRepository.save(review);
        
        if (review.getRestaurant() != null) {
            updateRestaurantRating(review.getRestaurant());
        }
        
        return convertToResponseDTO(review);
    }
    
    public List<ReviewResponseDTO> getReviewsByRestaurant(Long restaurantId) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        
        List<Review> reviews = reviewRepository.findByRestaurantOrderByCreatedAtDesc(restaurant);
        return reviews.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public Page<ReviewResponseDTO> getReviewsByRestaurantWithPagination(Long restaurantId, int page, int size) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        if (page < 0 || size <= 0) {
            throw new IllegalArgumentException("Invalid pagination parameters");
        }
        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findByRestaurantOrderByCreatedAtDesc(restaurant, pageable);
        return reviews.map(this::convertToResponseDTO);
    }
    
    public List<ReviewResponseDTO> getReviewsByCustomer(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        User customer = getUserByUsername(username);
        List<Review> reviews = reviewRepository.findByCustomerOrderByCreatedAtDesc(customer);
        return reviews.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public List<ReviewResponseDTO> getTopRatedReviewsByRestaurant(Long restaurantId, int limit) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        if (limit <= 0) {
            throw new IllegalArgumentException("Limit must be positive");
        }
        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        
        Pageable pageable = PageRequest.of(0, limit);
        List<Review> reviews = reviewRepository.findTopRatedReviewsByRestaurant(restaurant, pageable);
        return reviews.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public Double getAverageRatingByRestaurant(Long restaurantId) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        
        Double avgRating = reviewRepository.getAverageRatingByRestaurant(restaurant);
        return avgRating != null ? avgRating : 0.0;
    }
    
    public List<Object[]> getRatingDistributionByRestaurant(Long restaurantId) {
        if (restaurantId == null) {
            throw new IllegalArgumentException("Restaurant ID cannot be null");
        }
        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        
        return reviewRepository.getRatingDistributionByRestaurant(restaurant);
    }
    
    public boolean canReviewOrder(String username, Long orderId) {
        if (username == null || username.trim().isEmpty() || orderId == null) {
            return false;
        }
        
        try {
            User customer = getUserByUsername(username);
            Order order = orderRepository.findById(orderId)
                    .orElse(null);
            
            if (order == null) {
                return false;
            }
            
            return order.getCustomer().getId().equals(customer.getId()) &&
                   order.getStatus() == Order.OrderStatus.DELIVERED &&
                   !reviewRepository.existsByCustomerAndOrder(customer, order);
        } catch (Exception e) {
            log.error("Error checking review eligibility for user {} and order {}", username, orderId, e);
            return false;
        }
    }
    
    private void updateRestaurantRating(Restaurant restaurant) {
        try {
            Double avgRating = reviewRepository.getAverageRatingByRestaurant(restaurant);
            Long totalReviews = reviewRepository.countByRestaurant(restaurant);
            
            restaurant.setRating(avgRating != null ? avgRating : 0.0);
            restaurant.setTotalReviews(totalReviews.intValue());
            restaurantRepository.save(restaurant);
        } catch (Exception e) {
            log.error("Error updating restaurant rating for restaurant {}", restaurant.getId(), e);
        }
    }
    
    private ReviewResponseDTO convertToResponseDTO(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setReviewType(review.getReviewType().toString());
        dto.setFoodRating(review.getFoodRating());
        dto.setDeliveryRating(review.getDeliveryRating());
        dto.setServiceRating(review.getServiceRating());
        dto.setIsAnonymous(review.getIsAnonymous());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        
        if (!review.getIsAnonymous()) {
            dto.setCustomerId(review.getCustomer().getId());
            dto.setCustomerName(review.getCustomer().getName());
        }
        
        if (review.getRestaurant() != null) {
            dto.setRestaurantId(review.getRestaurant().getId());
            dto.setRestaurantName(review.getRestaurant().getName());
        }
        
        dto.setOrderId(review.getOrder().getId());
        dto.setOrderNumber(review.getOrder().getOrderNumber());
        
        if (review.getDeliveryPartner() != null) {
            dto.setDeliveryPartnerId(review.getDeliveryPartner().getId());
            dto.setDeliveryPartnerName(review.getDeliveryPartner().getName());
        }
        
        return dto;
    }
    
    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
    }
}