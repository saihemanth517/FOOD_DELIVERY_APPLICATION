package com.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.dto.OrderDTO;
import com.demo.dto.OrderStatusUpdateRequest;
import com.demo.service.SimulatedOrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderSimulationController {

    private final SimulatedOrderService orderService;

    public OrderSimulationController(SimulatedOrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<Void> simulateOrder() {
        orderService.generateSimulatedOrder();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pending")
    public ResponseEntity<List<OrderDTO>> getPendingOrders() {
        return ResponseEntity.ok(orderService.getPendingOrders());
    }
    
   

    @PostMapping("/{orderId}/accept")
    public ResponseEntity<String> acceptOrder(@PathVariable String orderId) {
        String deliveryPartnerIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("➡️ Accepting order with ID: " + orderId);
        System.out.println("➡️ Delivery Partner from token: " + deliveryPartnerIdStr);

        if (deliveryPartnerIdStr == null || deliveryPartnerIdStr.isBlank()) {
            return ResponseEntity.status(401).body("Unauthorized: No delivery partner ID");
        }

        try {
            Long deliveryPartnerId = Long.parseLong(deliveryPartnerIdStr);
            boolean success = orderService.acceptOrder(orderId, deliveryPartnerId);
            if (success) {
                return ResponseEntity.ok("Order accepted.");
            } else {
                return ResponseEntity.status(400).body("Order not found or already accepted.");
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid delivery partner ID format");
        }
    }

    
    @PostMapping("/{orderId}/reject")
    public ResponseEntity<String> rejectOrder(@PathVariable String orderId) {
        String deliveryPartnerId = SecurityContextHolder.getContext().getAuthentication().getName();

        if (deliveryPartnerId == null || deliveryPartnerId.isBlank()) {
            return ResponseEntity.status(401).body("Unauthorized: No delivery partner ID");
        }

        boolean success = orderService.rejectOrder(orderId, deliveryPartnerId);
        if (success) {
            return ResponseEntity.ok("Order rejected.");
        } else {
            return ResponseEntity.status(400).body("Order not found or already rejected.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
    @PostMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody OrderStatusUpdateRequest request) {

        String deliveryPartnerId = SecurityContextHolder.getContext().getAuthentication().getName();

        if (deliveryPartnerId == null || deliveryPartnerId.isBlank()) {
            return ResponseEntity.status(401).body("Unauthorized: No delivery partner ID");
        }

        boolean updated = orderService.updateOrderStatus(orderId, request.getStatus(), deliveryPartnerId);

        if (updated) {
            return ResponseEntity.ok("Order status updated to " + request.getStatus());
        } else {
            return ResponseEntity.status(404).body("Order not found or status update failed.");
        }
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<OrderDTO>> getDeliveryHistory() {
        String deliveryPartnerIdStr = SecurityContextHolder.getContext().getAuthentication().getName();

        if (deliveryPartnerIdStr == null || deliveryPartnerIdStr.isBlank()) {
            return ResponseEntity.status(401).build();
        }

        try {
            Long deliveryPartnerId = Long.parseLong(deliveryPartnerIdStr);
            return ResponseEntity.ok(orderService.getDeliveryHistory(deliveryPartnerId));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }



}
