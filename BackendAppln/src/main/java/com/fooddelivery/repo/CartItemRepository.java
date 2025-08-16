package com.fooddelivery.repo;

import com.fooddelivery.model.Cart;
import com.fooddelivery.model.CartItem;
import com.fooddelivery.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    // Find cart items by cart
    List<CartItem> findByCart(Cart cart);
    
    // Find cart item by cart and menu item
    Optional<CartItem> findByCartAndMenuItem(Cart cart, MenuItem menuItem);
    
    // Find cart items by cart ID
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartId")
    List<CartItem> findByCartId(@Param("cartId") Long cartId);
    
    // Delete all cart items by cart
    void deleteByCart(Cart cart);
    
    // Delete cart item by cart and menu item
    void deleteByCartAndMenuItem(Cart cart, MenuItem menuItem);
    
    // Check if cart item exists
    boolean existsByCartAndMenuItem(Cart cart, MenuItem menuItem);
    
    // Count items in cart
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.cart = :cart")
    Long countByCart(@Param("cart") Cart cart);
    
    // Get total quantity in cart
    @Query("SELECT COALESCE(SUM(ci.quantity), 0) FROM CartItem ci WHERE ci.cart = :cart")
    Integer getTotalQuantityByCart(@Param("cart") Cart cart);
    
    // Get total amount in cart
    @Query("SELECT COALESCE(SUM(ci.price * ci.quantity), 0.0) FROM CartItem ci WHERE ci.cart = :cart")
    Double getTotalAmountByCart(@Param("cart") Cart cart);
}
