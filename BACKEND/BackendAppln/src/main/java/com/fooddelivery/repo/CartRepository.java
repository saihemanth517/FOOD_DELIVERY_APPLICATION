package com.fooddelivery.repo;

import com.fooddelivery.model.Cart;
import com.fooddelivery.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    // Find cart by customer
    Optional<Cart> findByCustomer(User customer);
    
    // Find cart by customer ID
    @Query("SELECT c FROM Cart c WHERE c.customer.id = :customerId")
    Optional<Cart> findByCustomerId(@Param("customerId") Long customerId);
    
    // Check if customer has a cart
    boolean existsByCustomer(User customer);
    
    // Delete cart by customer
    void deleteByCustomer(User customer);
}
