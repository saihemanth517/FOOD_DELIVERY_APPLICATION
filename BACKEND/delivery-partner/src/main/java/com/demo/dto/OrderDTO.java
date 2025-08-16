package com.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private String id;
    private String customerName;
    private String address;
    private List<String> items;
    private LocalDateTime timestamp;
    private Long deliveryPartnerId;
    private String restaurantName; // ✅ NEW FIELD
    private String customerPhone;

    private String status;
}
