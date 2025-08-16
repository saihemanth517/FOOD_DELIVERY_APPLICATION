package com.fooddelivery.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrderRequestDTO {
    
    @NotBlank(message = "Delivery address is required")
    @Size(max = 1000, message = "Delivery address cannot exceed 1000 characters")
    private String deliveryAddress;
    
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String customerPhone;
    
    @NotNull(message = "Payment method is required")
    @Pattern(regexp = "^(RAZORPAY|COD)$", message = "Payment method must be RAZORPAY or COD")
    private String paymentMethod;
    
    private String paymentId; // For Razorpay payments
    
    @Size(max = 1000, message = "Special instructions cannot exceed 1000 characters")
    private String specialInstructions;
}
