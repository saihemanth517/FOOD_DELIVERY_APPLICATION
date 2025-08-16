package com.fooddelivery.service;

import com.fooddelivery.dto.*;
import com.fooddelivery.model.*;
import com.fooddelivery.repo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private static final double TAX_RATE = 0.18; // 18% tax
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final DeliveryStatusRepository deliveryStatusRepository;
    private final ReviewRepository reviewRepository;
    
    public OrderService(OrderRepository orderRepository,
                       OrderItemRepository orderItemRepository,
                       CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       UserRepository userRepository,
                       DeliveryStatusRepository deliveryStatusRepository,
                       ReviewRepository reviewRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.deliveryStatusRepository = deliveryStatusRepository;
        this.reviewRepository = reviewRepository;
    }
    
    public OrderResponseDTO createOrder(String username, OrderRequestDTO orderRequest) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (orderRequest == null) {
            throw new IllegalArgumentException("Order request cannot be null");
        }
        
        User customer = getUserByUsername(username);
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new IllegalArgumentException("Cart is empty"));
        
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }
        
        Restaurant restaurant = cart.getRestaurant();
        if (cart.getTotalAmount() < restaurant.getMinOrderAmount()) {
            throw new IllegalArgumentException("Order amount is below minimum order amount of ₹" + restaurant.getMinOrderAmount());
        }
        
        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setSubtotal(cart.getTotalAmount());
        order.setDeliveryFee(restaurant.getDeliveryFee());
        order.setTaxAmount(cart.getTotalAmount() * TAX_RATE);
        order.setTotalAmount(order.getSubtotal() + order.getDeliveryFee() + order.getTaxAmount());
        order.setDeliveryAddress(orderRequest.getDeliveryAddress());
        order.setCustomerPhone(orderRequest.getCustomerPhone());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setPaymentId(orderRequest.getPaymentId());
        order.setSpecialInstructions(orderRequest.getSpecialInstructions());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentStatus("PENDING");
        order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(restaurant.getAvgDeliveryTime()));
        
        order = orderRepository.save(order);
        
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(cartItem.getMenuItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setItemName(cartItem.getMenuItem().getName());
            orderItem.setSpecialInstructions(cartItem.getSpecialInstructions());
            orderItemRepository.save(orderItem);
        }
        
        createDeliveryStatus(order, DeliveryStatus.Status.ORDER_PLACED, "Order has been placed successfully");
        
        cartItemRepository.deleteByCart(cart);
        cart.setRestaurant(null);
        cart.setTotalAmount(0.0);
        cart.setTotalItems(0);
        cartRepository.save(cart);
        
        return convertToResponseDTO(order);
    }
    
    public OrderResponseDTO updateOrderStatus(Long orderId, Order.OrderStatus status) {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        
        order.setStatus(status);
        order = orderRepository.save(order);
        
        DeliveryStatus.Status deliveryStatus = mapOrderStatusToDeliveryStatus(status);
        if (deliveryStatus != null) {
            createDeliveryStatus(order, deliveryStatus, deliveryStatus.getDescription());
        }
        
        if (status == Order.OrderStatus.DELIVERED) {
            order.setActualDeliveryTime(LocalDateTime.now());
            orderRepository.save(order);
        }
        
        return convertToResponseDTO(order);
    }
    
    public OrderResponseDTO updatePaymentStatus(String orderNumber, String paymentStatus, String paymentId) {
        if (orderNumber == null || orderNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Order number cannot be null or empty");
        }
        if (paymentStatus == null || paymentStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("Payment status cannot be null or empty");
        }
        
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        
        order.setPaymentStatus(paymentStatus);
        if (paymentId != null) {
            order.setPaymentId(paymentId);
        }
        
        if ("COMPLETED".equals(paymentStatus)) {
            order.setStatus(Order.OrderStatus.CONFIRMED);
            createDeliveryStatus(order, DeliveryStatus.Status.ORDER_CONFIRMED, "Payment completed and order confirmed");
        }
        
        order = orderRepository.save(order);
        return convertToResponseDTO(order);
    }
    
    public List<OrderResponseDTO> getOrdersByCustomer(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        User customer = getUserByUsername(username);
        List<Order> orders = orderRepository.findByCustomerOrderByCreatedAtDesc(customer);
        return orders.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public Page<OrderResponseDTO> getOrdersByCustomerWithPagination(String username, int page, int size) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (page < 0 || size <= 0) {
            throw new IllegalArgumentException("Invalid pagination parameters");
        }
        
        User customer = getUserByUsername(username);
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findByCustomerOrderByCreatedAtDesc(customer, pageable);
        return orders.map(this::convertToResponseDTO);
    }
    
    public List<OrderResponseDTO> getActiveOrdersByCustomer(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        User customer = getUserByUsername(username);
        List<Order> orders = orderRepository.findActiveOrdersByCustomer(customer);
        return orders.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<OrderResponseDTO> getOrderById(Long orderId) {
        if (orderId == null) {
            return Optional.empty();
        }
        
        Optional<Order> order = orderRepository.findById(orderId);
        return order.map(this::convertToResponseDTO);
    }
    
    public Optional<OrderResponseDTO> getOrderByIdAndCustomer(Long orderId, String username) {
        if (orderId == null || username == null || username.trim().isEmpty()) {
            return Optional.empty();
        }
        
        User customer = getUserByUsername(username);
        Optional<Order> order = orderRepository.findByIdAndCustomer(orderId, customer);
        return order.map(this::convertToResponseDTO);
    }
    
    public Optional<OrderResponseDTO> getOrderByOrderNumber(String orderNumber) {
        if (orderNumber == null || orderNumber.trim().isEmpty()) {
            return Optional.empty();
        }
        
        Optional<Order> order = orderRepository.findByOrderNumber(orderNumber);
        return order.map(this::convertToResponseDTO);
    }
    
    public Optional<OrderResponseDTO> getOrderByOrderNumberAndCustomer(String orderNumber, String username) {
        if (orderNumber == null || orderNumber.trim().isEmpty() || 
            username == null || username.trim().isEmpty()) {
            return Optional.empty();
        }
        
        User customer = getUserByUsername(username);
        // Optional<Order> order = orderRepository.findByOrderNumberAndCustomer(orderNumber, customer);
        // return order.map(this::convertToResponseDTO);
    }
    
    public OrderResponseDTO cancelOrder(String username, Long orderId) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        
        User customer = getUserByUsername(username);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        
        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new IllegalArgumentException("Order does not belong to customer");
        }
        
        if (order.getStatus() == Order.OrderStatus.DELIVERED || 
            order.getStatus() == Order.OrderStatus.CANCELLED ||
            order.getStatus() == Order.OrderStatus.OUT_FOR_DELIVERY) {
            throw new IllegalArgumentException("Order cannot be cancelled at this stage");
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        order = orderRepository.save(order);
        
        createDeliveryStatus(order, DeliveryStatus.Status.CANCELLED, "Order cancelled by customer");
        
        return convertToResponseDTO(order);
    }
    
    private void createDeliveryStatus(Order order, DeliveryStatus.Status status, String description) {
        DeliveryStatus deliveryStatus = new DeliveryStatus();
        deliveryStatus.setOrder(order);
        deliveryStatus.setStatus(status);
        deliveryStatus.setDescription(description);
        deliveryStatusRepository.save(deliveryStatus);
    }
    
    private DeliveryStatus.Status mapOrderStatusToDeliveryStatus(Order.OrderStatus orderStatus) {
        return switch (orderStatus) {
            case PENDING -> DeliveryStatus.Status.ORDER_PLACED;
            case CONFIRMED -> DeliveryStatus.Status.ORDER_CONFIRMED;
            case PREPARING -> DeliveryStatus.Status.PREPARING;
            case READY_FOR_PICKUP -> DeliveryStatus.Status.READY_FOR_PICKUP;
            case OUT_FOR_DELIVERY -> DeliveryStatus.Status.OUT_FOR_DELIVERY;
            case DELIVERED -> DeliveryStatus.Status.DELIVERED;
            case CANCELLED -> DeliveryStatus.Status.CANCELLED;
        };
    }
    
    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
    }

    private OrderResponseDTO convertToResponseDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setStatus(order.getStatus().toString());
        dto.setSubtotal(order.getSubtotal());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setCustomerPhone(order.getCustomerPhone());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentId(order.getPaymentId());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setSpecialInstructions(order.getSpecialInstructions());
        dto.setEstimatedDeliveryTime(order.getEstimatedDeliveryTime());
        dto.setActualDeliveryTime(order.getActualDeliveryTime());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getName());

        dto.setRestaurantId(order.getRestaurant().getId());
        dto.setRestaurantName(order.getRestaurant().getName());
        dto.setRestaurantImageUrl(order.getRestaurant().getImageUrl());
        dto.setRestaurantPhone(order.getRestaurant().getPhone());

        if (order.getDeliveryPartner() != null) {
            dto.setDeliveryPartnerId(order.getDeliveryPartner().getId());
            dto.setDeliveryPartnerName(order.getDeliveryPartner().getName());
            dto.setDeliveryPartnerPhone(order.getDeliveryPartner().getUsername());
        }

        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
        List<OrderItemResponseDTO> orderItemDTOs = orderItems.stream()
                .map(this::convertOrderItemToResponseDTO)
                .collect(Collectors.toList());
        dto.setOrderItems(orderItemDTOs);

        List<DeliveryStatus> deliveryStatuses = deliveryStatusRepository.findByOrderOrderByCreatedAtDesc(order);
        List<DeliveryStatusResponseDTO> deliveryStatusDTOs = deliveryStatuses.stream()
                .map(this::convertDeliveryStatusToResponseDTO)
                .collect(Collectors.toList());
        dto.setDeliveryStatusUpdates(deliveryStatusDTOs);

        dto.setCanReview(order.getStatus() == Order.OrderStatus.DELIVERED);
        dto.setHasReviewed(reviewRepository.existsByCustomerAndOrder(order.getCustomer(), order));

        return dto;
    }

    private OrderItemResponseDTO convertOrderItemToResponseDTO(OrderItem orderItem) {
        OrderItemResponseDTO dto = new OrderItemResponseDTO();
        dto.setId(orderItem.getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setItemName(orderItem.getItemName());
        dto.setSpecialInstructions(orderItem.getSpecialInstructions());
        dto.setCreatedAt(orderItem.getCreatedAt());
        dto.setUpdatedAt(orderItem.getUpdatedAt());
        dto.setTotalPrice(orderItem.getPrice() * orderItem.getQuantity());

        MenuItem menuItem = orderItem.getMenuItem();
        dto.setMenuItemId(menuItem.getId());
        dto.setMenuItemImageUrl(menuItem.getImageUrl());
        dto.setIsVegetarian(menuItem.getIsVegetarian());
        dto.setIsVegan(menuItem.getIsVegan());
        // dto.setSpiceLevel(menuItem.getSpiceLevel());
        dto.setCategory(menuItem.getCategory());

        return dto;
    }

    private DeliveryStatusResponseDTO convertDeliveryStatusToResponseDTO(DeliveryStatus deliveryStatus) {
        DeliveryStatusResponseDTO dto = new DeliveryStatusResponseDTO();
        dto.setId(deliveryStatus.getId());
        dto.setStatus(deliveryStatus.getStatus().toString());
        dto.setDescription(deliveryStatus.getDescription());
        dto.setLocationLatitude(deliveryStatus.getLocationLatitude());
        dto.setLocationLongitude(deliveryStatus.getLocationLongitude());
        dto.setEstimatedTime(deliveryStatus.getEstimatedTime());
        dto.setCreatedAt(deliveryStatus.getCreatedAt());

        dto.setOrderId(deliveryStatus.getOrder().getId());
        dto.setOrderNumber(deliveryStatus.getOrder().getOrderNumber());

        if (deliveryStatus.getDeliveryPartner() != null) {
            dto.setDeliveryPartnerId(deliveryStatus.getDeliveryPartner().getId());
            dto.setDeliveryPartnerName(deliveryStatus.getDeliveryPartner().getName());
            dto.setDeliveryPartnerPhone(deliveryStatus.getDeliveryPartner().getUsername());
        }

        return dto;
    }
}