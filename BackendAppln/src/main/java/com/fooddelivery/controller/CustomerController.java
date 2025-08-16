package com.fooddelivery.controller;

import com.fooddelivery.dto.*;
import com.fooddelivery.service.*;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {
    
    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);
    
    private final RestaurantService restaurantService;
    private final MenuService menuService;
    private final CartService cartService;
    private final OrderService orderService;
    private final ReviewService reviewService;
    
    public CustomerController(RestaurantService restaurantService,
                            MenuService menuService,
                            CartService cartService,
                            OrderService orderService,
                            ReviewService reviewService) {
        this.restaurantService = restaurantService;
        this.menuService = menuService;
        this.cartService = cartService;
        this.orderService = orderService;
        this.reviewService = reviewService;
    }
    
    // Utility methods
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
    
    // Restaurant endpoints
    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantResponseDTO>> getAllRestaurants() {
        List<RestaurantResponseDTO> restaurants = restaurantService.getAllActiveRestaurants();
        return ResponseEntity.ok(restaurants);
    }
    
    @PostMapping("/restaurants/search")
    public ResponseEntity<Page<RestaurantResponseDTO>> searchRestaurants(
            @RequestBody RestaurantSearchRequestDTO searchRequest) {
        Page<RestaurantResponseDTO> restaurants = restaurantService.searchRestaurants(searchRequest);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/restaurants/{id}")
    public ResponseEntity<RestaurantResponseDTO> getRestaurantById(@PathVariable Long id) {
        Optional<RestaurantResponseDTO> restaurant = restaurantService.getRestaurantById(id);
        return restaurant.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/restaurants/cuisine/{cuisineType}")
    public ResponseEntity<List<RestaurantResponseDTO>> getRestaurantsByCuisine(
            @PathVariable String cuisineType) {
        List<RestaurantResponseDTO> restaurants = restaurantService.getRestaurantsByCuisine(cuisineType);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/restaurants/top-rated")
    public ResponseEntity<List<RestaurantResponseDTO>> getTopRatedRestaurants(
            @RequestParam(defaultValue = "10") int limit) {
        List<RestaurantResponseDTO> restaurants = restaurantService.getTopRatedRestaurants(limit);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/restaurants/cuisines")
    public ResponseEntity<List<String>> getAllCuisineTypes() {
        List<String> cuisines = restaurantService.getAllCuisineTypes();
        return ResponseEntity.ok(cuisines);
    }
    
    // Menu endpoints
    @GetMapping("/restaurants/{restaurantId}/menu")
    public ResponseEntity<List<MenuItemResponseDTO>> getMenuByRestaurant(
            @PathVariable Long restaurantId) {
        try {
            List<MenuItemResponseDTO> menuItems = menuService.getMenuItemsByRestaurant(restaurantId);
            return ResponseEntity.ok(menuItems);
        } catch (IllegalArgumentException e) {
            log.error("Invalid restaurant ID: {}", restaurantId, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching menu for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/menu/search")
    public ResponseEntity<Page<MenuItemResponseDTO>> searchMenuItems(
            @RequestBody MenuItemSearchRequestDTO searchRequest) {
        try {
            Page<MenuItemResponseDTO> menuItems = menuService.searchMenuItems(searchRequest);
            return ResponseEntity.ok(menuItems);
        } catch (IllegalArgumentException e) {
            log.error("Invalid search request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error searching menu items", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/menu/{id}")
    public ResponseEntity<MenuItemResponseDTO> getMenuItemById(@PathVariable Long id) {
        Optional<MenuItemResponseDTO> menuItem = menuService.getMenuItemById(id);
        return menuItem.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/restaurants/{restaurantId}/menu/categories")
    public ResponseEntity<List<String>> getCategoriesByRestaurant(@PathVariable Long restaurantId) {
        try {
            List<String> categories = menuService.getCategoriesByRestaurant(restaurantId);
            return ResponseEntity.ok(categories);
        } catch (IllegalArgumentException e) {
            log.error("Invalid restaurant ID: {}", restaurantId, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching categories for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/restaurants/{restaurantId}/menu/category/{category}")
    public ResponseEntity<List<MenuItemResponseDTO>> getMenuItemsByCategory(
            @PathVariable Long restaurantId, @PathVariable String category) {
        try {
            List<MenuItemResponseDTO> menuItems = menuService.getMenuItemsByCategory(restaurantId, category);
            return ResponseEntity.ok(menuItems);
        } catch (IllegalArgumentException e) {
            log.error("Invalid parameters - restaurant ID: {}, category: {}", restaurantId, category, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching menu items by category for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/restaurants/{restaurantId}/menu/vegetarian")
    public ResponseEntity<List<MenuItemResponseDTO>> getVegetarianMenuItems(
            @PathVariable Long restaurantId) {
        try {
            List<MenuItemResponseDTO> menuItems = menuService.getVegetarianMenuItems(restaurantId);
            return ResponseEntity.ok(menuItems);
        } catch (IllegalArgumentException e) {
            log.error("Invalid restaurant ID: {}", restaurantId, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching vegetarian menu items for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Cart endpoints
    @GetMapping("/cart")
    public ResponseEntity<CartResponseDTO> getCart(Authentication authentication) {
        String username = authentication.getName();
        CartResponseDTO cart = cartService.getCartByCustomer(username);
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/cart/add")
    public ResponseEntity<Map<String, Object>> addItemToCart(
            @Valid @RequestBody CartRequestDTO cartRequest, 
            Authentication authentication) {
        try {
            String username = authentication.getName();
            CartResponseDTO cart = cartService.addItemToCart(username, cartRequest);
            return ResponseEntity.ok(createSuccessResponse("Item added to cart successfully", cart));
        } catch (IllegalArgumentException e) {
            log.error("Invalid cart request for user {}: {}", authentication.getName(), e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error adding item to cart for user {}", authentication.getName(), e);
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to add item to cart"));
        }
    }
    
    @PutMapping("/cart/items/{cartItemId}")
    public ResponseEntity<Map<String, Object>> updateCartItem(
            @PathVariable Long cartItemId,
            @Valid @RequestBody CartRequestDTO cartRequest,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            CartResponseDTO cart = cartService.updateCartItem(username, cartItemId, cartRequest);
            return ResponseEntity.ok(createSuccessResponse("Cart item updated successfully", cart));
        } catch (IllegalArgumentException e) {
            log.error("Invalid update request for cart item {} by user {}: {}", cartItemId, authentication.getName(), e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error updating cart item {} for user {}", cartItemId, authentication.getName(), e);
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to update cart item"));
        }
    }
    
    @DeleteMapping("/cart/items/{cartItemId}")
    public ResponseEntity<Map<String, Object>> removeItemFromCart(
            @PathVariable Long cartItemId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            CartResponseDTO cart = cartService.removeItemFromCart(username, cartItemId);
            return ResponseEntity.ok(createSuccessResponse("Item removed from cart successfully", cart));
        } catch (IllegalArgumentException e) {
            log.error("Invalid remove request for cart item {} by user {}: {}", cartItemId, authentication.getName(), e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error removing cart item {} for user {}", cartItemId, authentication.getName(), e);
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to remove cart item"));
        }
    }
    
    @DeleteMapping("/cart/clear")
    public ResponseEntity<Map<String, Object>> clearCart(Authentication authentication) {
        try {
            String username = authentication.getName();
            cartService.clearCart(username);
            return ResponseEntity.ok(createSuccessResponse("Cart cleared successfully", null));
        } catch (Exception e) {
            log.error("Error clearing cart for user {}", authentication.getName(), e);
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to clear cart"));
        }
    }

    // Order endpoints
    @PostMapping("/orders")
    public ResponseEntity<Map<String, Object>> createOrder(
            @Valid @RequestBody OrderRequestDTO orderRequest,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            OrderResponseDTO order = orderService.createOrder(username, orderRequest);
            return ResponseEntity.ok(createSuccessResponse("Order created successfully", order));
        } catch (IllegalArgumentException e) {
            log.error("Invalid order request for user {}: {}", authentication.getName(), e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating order for user {}", authentication.getName(), e);
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to create order"));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponseDTO>> getOrders(Authentication authentication) {
        String username = authentication.getName();
        List<OrderResponseDTO> orders = orderService.getOrdersByCustomer(username);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/paginated")
    public ResponseEntity<Page<OrderResponseDTO>> getOrdersWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String username = authentication.getName();
        Page<OrderResponseDTO> orders = orderService.getOrdersByCustomerWithPagination(username, page, size);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/active")
    public ResponseEntity<List<OrderResponseDTO>> getActiveOrders(Authentication authentication) {
        String username = authentication.getName();
        List<OrderResponseDTO> orders = orderService.getActiveOrdersByCustomer(username);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication) {
        String username = authentication.getName();
        Optional<OrderResponseDTO> order = orderService.getOrderByIdAndCustomer(orderId, username);
        return order.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/orders/number/{orderNumber}")
    public ResponseEntity<OrderResponseDTO> getOrderByOrderNumber(
            @PathVariable String orderNumber,
            Authentication authentication) {
        String username = authentication.getName();
        Optional<OrderResponseDTO> order = orderService.getOrderByOrderNumberAndCustomer(orderNumber, username);
        return order.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            OrderResponseDTO order = orderService.cancelOrder(username, orderId);
            return ResponseEntity.ok(createSuccessResponse("Order cancelled successfully", order));
        } catch (IllegalArgumentException e) {
            log.error("Invalid cancel request for order {} by user {}: {}", orderId, authentication.getName(), e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error cancelling order {} for user {}", orderId, authentication.getName(), e);
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to cancel order"));
        }
    }

    @PutMapping("/orders/{orderNumber}/payment")
    public ResponseEntity<Map<String, Object>> updatePaymentStatus(
            @PathVariable String orderNumber,
            @RequestParam String paymentStatus,
            @RequestParam(required = false) String paymentId) {
        try {
            OrderResponseDTO order = orderService.updatePaymentStatus(orderNumber, paymentStatus, paymentId);
            return ResponseEntity.ok(createSuccessResponse("Payment status updated successfully", order));
        } catch (IllegalArgumentException e) {
            log.error("Invalid payment update for order {}: {}", orderNumber, e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error updating payment status for order {}", orderNumber, e);
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to update payment status"));
        }
    }

    // Review endpoints
    @PostMapping("/reviews")
    public ResponseEntity<Map<String, Object>> createReview(
            @Valid @RequestBody ReviewRequestDTO reviewRequest,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            ReviewResponseDTO review = reviewService.createReview(username, reviewRequest);
            return ResponseEntity.ok(createSuccessResponse("Review created successfully", review));
        } catch (IllegalArgumentException e) {
            log.error("Invalid review request for user {}: {}", authentication.getName(), e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating review for user {}", authentication.getName(), e);
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to create review"));
        }
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getMyReviews(Authentication authentication) {
        String username = authentication.getName();
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByCustomer(username);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/restaurants/{restaurantId}/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getRestaurantReviews(@PathVariable Long restaurantId) {
        try {
            List<ReviewResponseDTO> reviews = reviewService.getReviewsByRestaurant(restaurantId);
            return ResponseEntity.ok(reviews);
        } catch (IllegalArgumentException e) {
            log.error("Invalid restaurant ID: {}", restaurantId, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching reviews for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/restaurants/{restaurantId}/reviews/paginated")
    public ResponseEntity<Page<ReviewResponseDTO>> getRestaurantReviewsWithPagination(
            @PathVariable Long restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<ReviewResponseDTO> reviews = reviewService.getReviewsByRestaurantWithPagination(restaurantId, page, size);
            return ResponseEntity.ok(reviews);
        } catch (IllegalArgumentException e) {
            log.error("Invalid parameters for restaurant reviews - ID: {}, page: {}, size: {}", restaurantId, page, size, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching paginated reviews for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/restaurants/{restaurantId}/reviews/top-rated")
    public ResponseEntity<List<ReviewResponseDTO>> getTopRatedRestaurantReviews(
            @PathVariable Long restaurantId,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            List<ReviewResponseDTO> reviews = reviewService.getTopRatedReviewsByRestaurant(restaurantId, limit);
            return ResponseEntity.ok(reviews);
        } catch (IllegalArgumentException e) {
            log.error("Invalid parameters for top-rated reviews - restaurant ID: {}, limit: {}", restaurantId, limit, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching top-rated reviews for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/restaurants/{restaurantId}/rating")
    public ResponseEntity<Map<String, Object>> getRestaurantRating(@PathVariable Long restaurantId) {
        try {
            Double avgRating = reviewService.getAverageRatingByRestaurant(restaurantId);
            List<Object[]> ratingDistribution = reviewService.getRatingDistributionByRestaurant(restaurantId);

            Map<String, Object> response = new HashMap<>();
            response.put("averageRating", avgRating);
            response.put("ratingDistribution", ratingDistribution);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid restaurant ID for rating: {}", restaurantId, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching rating for restaurant: {}", restaurantId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/orders/{orderId}/can-review")
    public ResponseEntity<Map<String, Object>> canReviewOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            boolean canReview = reviewService.canReviewOrder(username, orderId);

            Map<String, Object> response = new HashMap<>();
            response.put("canReview", canReview);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid review check for order {} by user {}: {}", orderId, authentication.getName(), e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("canReview", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error("Error checking review eligibility for order {} by user {}", orderId, authentication.getName(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("canReview", false);
            response.put("message", "Unable to check review eligibility");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}