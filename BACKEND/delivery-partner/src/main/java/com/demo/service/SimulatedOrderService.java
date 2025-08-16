package com.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;

import com.demo.dto.OrderDTO;
import com.demo.security.FakeDataUtil;

@Service
public class SimulatedOrderService {

    private final List<OrderDTO> simulatedOrders = new CopyOnWriteArrayList<>();
    private final Map<String, OrderDTO> acceptedOrders = new ConcurrentHashMap<>();
    private final Map<String, OrderDTO> orderMap = new ConcurrentHashMap<>();
    private final List<OrderDTO> deliveryHistory = new CopyOnWriteArrayList<>();



    public void generateSimulatedOrder() {
        OrderDTO order = new OrderDTO();
        order.setId(UUID.randomUUID().toString());
        order.setCustomerName(FakeDataUtil.getRandomCustomer());
        order.setAddress(FakeDataUtil.getRandomAddress());
        order.setCustomerPhone(FakeDataUtil.getRandomPhone());

        order.setItems(FakeDataUtil.getRandomItems());
        order.setTimestamp(LocalDateTime.now());
        order.setDeliveryPartnerId(null);
        order.setRestaurantName(FakeDataUtil.getRandomRestaurant());
        order.setStatus("PENDING"); // default status

        simulatedOrders.add(order);
    }

    public List<OrderDTO> getPendingOrders() {
        return simulatedOrders.stream()
            .filter(o -> o.getDeliveryPartnerId() == null) // Only orders not yet accepted
            .toList();
    }


    public void clearOrders() {
        simulatedOrders.clear();
        acceptedOrders.clear();
    }

    public boolean acceptOrder(String orderId, Long deliveryPartnerId) {
        Optional<OrderDTO> match = simulatedOrders.stream()
            .filter(o -> o.getId().equals(orderId))
            .findFirst();

        if (match.isPresent()) {
            OrderDTO order = match.get();
            order.setDeliveryPartnerId(deliveryPartnerId);
            order.setStatus("ACCEPTED"); // ✅ Set correct status
            simulatedOrders.remove(order);
            acceptedOrders.put(orderId, order);
            return true;
        }

        return false;
    }

    
    public boolean rejectOrder(String orderId, String deliveryPartnerId) {
        Optional<OrderDTO> match = simulatedOrders.stream()
            .filter(o -> o.getId().equals(orderId))
            .findFirst();

        if (match.isPresent()) {
            OrderDTO order = match.get();
            // Optionally: Log who rejected
            simulatedOrders.remove(order);
            return true;
        }

        return false;
    }
    public OrderDTO getOrderById(String id) {
        // Search accepted orders first
        if (acceptedOrders.containsKey(id)) {
            return acceptedOrders.get(id);
        }

        // Then search simulated orders
        return simulatedOrders.stream()
            .filter(order -> order.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Order not found"));
    }
    
    public boolean updateOrderStatus(String orderId, String newStatus, String deliveryPartnerId) {
        OrderDTO order = acceptedOrders.get(orderId);

        if (order == null) {
            return false;
        }

        try {
            Long idFromToken = Long.parseLong(deliveryPartnerId);
            if (!idFromToken.equals(order.getDeliveryPartnerId())) {
                return false;
            }
        } catch (NumberFormatException e) {
            return false;
        }

        order.setStatus(newStatus);

        if ("DELIVERED".equalsIgnoreCase(newStatus)) {
            acceptedOrders.remove(orderId);
            deliveryHistory.add(order);
        }

        return true;
    }



    public List<OrderDTO> getDeliveryHistory(Long deliveryPartnerId) {
        return deliveryHistory.stream()
            .filter(order -> deliveryPartnerId.equals(order.getDeliveryPartnerId()))
            .toList();
    }


}
  