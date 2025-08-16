package com.demo.dto;

import lombok.Data;

@Data
public class DeliveryPartnerRegisterDTO {
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String vehicleNumber;
}
