package com.fooddelivery.service;

import com.fooddelivery.dto.CartRequestDTO;
import com.fooddelivery.dto.CartResponseDTO;
import com.fooddelivery.dto.CartItemResponseDTO;
import com.fooddelivery.model.*;
import com.fooddelivery.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private static final double TAX_RATE = 0.18; // 18% tax
    
    public CartResponseDTO getCartByCustomer(String username) {
        User customer = getUserByUsername(username);
        Optional<Cart> cartOpt = cartRepository.findByCustomer(customer);
        
        if (cartOpt.isEmpty()) {
            // Create new empty cart
            Cart cart = new Cart();
            cart.setCustomer(customer);
            cart = cartRepository.save(cart);
            return convertToResponseDTO(cart);
        }
        
        return convertToResponseDTO(cartOpt.get());
    }
    
    public CartResponseDTO addItemToCart(String username, CartRequestDTO cartRequest) {
        User customer = getUserByUsername(username);
        MenuItem menuItem = getMenuItemById(cartRequest.getMenuItemId());
        
        // Get or create cart
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    return cartRepository.save(newCart);
                });
        
        // Check if cart has items from different restaurant
        if (cart.getRestaurant() != null && !cart.getRestaurant().getId().equals(menuItem.getRestaurant().getId())) {
            throw new RuntimeException("Cannot add items from different restaurants. Please clear your cart first.");
        }
        
        // Set restaurant if not set
        if (cart.getRestaurant() == null) {
            cart.setRestaurant(menuItem.getRestaurant());
            cart = cartRepository.save(cart);
        }
        
        // Check if item already exists in cart
        Optional<CartItem> existingCartItem = cartItemRepository.findByCartAndMenuItem(cart, menuItem);
        
        if (existingCartItem.isPresent()) {
            // Update quantity
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartRequest.getQuantity());
            cartItem.setSpecialInstructions(cartRequest.getSpecialInstructions());
            cartItemRepository.save(cartItem);
        } else {
            // Add new item
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setMenuItem(menuItem);
            cartItem.setQuantity(cartRequest.getQuantity());
            cartItem.setPrice(menuItem.getPrice().doubleValue());
            cartItem.setSpecialInstructions(cartRequest.getSpecialInstructions());
            cartItemRepository.save(cartItem);
        }
        
        // Update cart totals
        updateCartTotals(cart);
        
        return convertToResponseDTO(cart);
    }
    
    public CartResponseDTO updateCartItem(String username, Long cartItemId, CartRequestDTO cartRequest) {
        User customer = getUserByUsername(username);
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        // Verify cart item belongs to customer's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to customer");
        }
        
        cartItem.setQuantity(cartRequest.getQuantity());
        cartItem.setSpecialInstructions(cartRequest.getSpecialInstructions());
        cartItemRepository.save(cartItem);
        
        // Update cart totals
        updateCartTotals(cart);
        
        return convertToResponseDTO(cart);
    }
    
    public CartResponseDTO removeItemFromCart(String username, Long cartItemId) {
        User customer = getUserByUsername(username);
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        // Verify cart item belongs to customer's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to customer");
        }
        
        cartItemRepository.delete(cartItem);
        
        // Update cart totals
        updateCartTotals(cart);
        
        // If cart is empty, clear restaurant
        if (cart.getTotalItems() == 0) {
            cart.setRestaurant(null);
            cartRepository.save(cart);
        }
        
        return convertToResponseDTO(cart);
    }
    
    public void clearCart(String username) {
        User customer = getUserByUsername(username);
        Optional<Cart> cartOpt = cartRepository.findByCustomer(customer);
        
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            cartItemRepository.deleteByCart(cart);
            cart.setRestaurant(null);
            cart.setTotalAmount(0.0);
            cart.setTotalItems(0);
            cartRepository.save(cart);
        }
    }
    
    private void updateCartTotals(Cart cart) {
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        
        double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        
        int totalItems = cartItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
        
        cart.setTotalAmount(totalAmount);
        cart.setTotalItems(totalItems);
        cartRepository.save(cart);
    }
    
    private CartResponseDTO convertToResponseDTO(Cart cart) {
        CartResponseDTO dto = new CartResponseDTO();
        dto.setId(cart.getId());
        dto.setTotalAmount(cart.getTotalAmount());
        dto.setTotalItems(cart.getTotalItems());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setUpdatedAt(cart.getUpdatedAt());
        
        // Set restaurant info
        if (cart.getRestaurant() != null) {
            dto.setRestaurantId(cart.getRestaurant().getId());
            dto.setRestaurantName(cart.getRestaurant().getName());
            dto.setRestaurantImageUrl(cart.getRestaurant().getImageUrl());
            dto.setDeliveryFee(cart.getRestaurant().getDeliveryFee());
            dto.setMinOrderAmount(cart.getRestaurant().getMinOrderAmount());
        }
        
        // Set cart items
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        List<CartItemResponseDTO> cartItemDTOs = cartItems.stream()
                .map(this::convertCartItemToResponseDTO)
                .collect(Collectors.toList());
        dto.setCartItems(cartItemDTOs);
        
        // Calculate totals
        dto.setSubtotal(cart.getTotalAmount());
        dto.setTaxAmount(cart.getTotalAmount() * TAX_RATE);
        double grandTotal = cart.getTotalAmount() + dto.getTaxAmount();
        if (cart.getRestaurant() != null) {
            grandTotal += cart.getRestaurant().getDeliveryFee();
        }
        dto.setGrandTotal(grandTotal);
        
        return dto;
    }
    
    private CartItemResponseDTO convertCartItemToResponseDTO(CartItem cartItem) {
        CartItemResponseDTO dto = new CartItemResponseDTO();
        dto.setId(cartItem.getId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setPrice(cartItem.getPrice());
        dto.setSpecialInstructions(cartItem.getSpecialInstructions());
        dto.setCreatedAt(cartItem.getCreatedAt());
        dto.setUpdatedAt(cartItem.getUpdatedAt());
        dto.setTotalPrice(cartItem.getPrice() * cartItem.getQuantity());
        
        // Set menu item info
        MenuItem menuItem = cartItem.getMenuItem();
        dto.setMenuItemId(menuItem.getId());
        dto.setMenuItemName(menuItem.getName());
        dto.setMenuItemDescription(menuItem.getDescription());
        dto.setMenuItemImageUrl(menuItem.getImageUrl());
        dto.setIsVegetarian(menuItem.getIsVegetarian());
        dto.setIsVegan(menuItem.getIsVegan());
        dto.setSpiceLevel(menuItem.getSpiceLevel() != null ? menuItem.getSpiceLevel().toString() : null);
        dto.setCategory(menuItem.getCategory());
        
        return dto;
    }
    
    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
    
    private MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found: " + id));
    }
}
