package com.demo.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.demo.model.DeliveryPartner;
import com.demo.repository.DeliveryPartnerRepository;
import com.demo.security.JwtUtil;

@RestController
@RequestMapping("/api/delivery/auth")
@CrossOrigin(origins = "*")
public class DeliveryAuthController {

    @Autowired
    private DeliveryPartnerRepository partnerRepo;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Register a new delivery partner
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody DeliveryPartner partner) {
        Optional<DeliveryPartner> existingByPhone = partnerRepo.findByPhone(partner.getPhone());
        if (existingByPhone.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Phone number already registered.");
        }

        Optional<DeliveryPartner> existingByEmail = partnerRepo.findByEmail(partner.getEmail());
        if (existingByEmail.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered.");
        }

        partner.setActive(true);
        partner.setAvailable(true);

        DeliveryPartner saved = partnerRepo.save(partner);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ✅ Login and return JWT token
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String phone = credentials.get("phone");
        String password = credentials.get("password");

        DeliveryPartner partner = partnerRepo.findByPhone(phone).orElse(null);

        if (partner == null || !partner.getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(partner.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("partnerId", partner.getId());
        response.put("name", partner.getFullName());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/availability")
    public ResponseEntity<?> updateAvailability(@RequestBody Map<String, Boolean> payload, @RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        Long partnerId = Long.parseLong(jwtUtil.extractUserId(token));

        Optional<DeliveryPartner> optionalPartner = partnerRepo.findById(partnerId);
        if (optionalPartner.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Delivery partner not found");
        }

        DeliveryPartner partner = optionalPartner.get();
        Boolean isAvailable = payload.get("isAvailable");
        partner.setAvailable(isAvailable);
        partnerRepo.save(partner);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Availability updated");
        response.put("isAvailable", partner.isAvailable());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/availability")
    public ResponseEntity<?> getAvailability(@RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        Long partnerId = Long.parseLong(jwtUtil.extractUserId(token));

        Optional<DeliveryPartner> optionalPartner = partnerRepo.findById(partnerId);
        if (optionalPartner.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Delivery partner not found");
        }

        return ResponseEntity.ok(Map.of("isAvailable", optionalPartner.get().isAvailable()));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        Long partnerId = Long.parseLong(jwtUtil.extractUserId(token));

        Optional<DeliveryPartner> optionalPartner = partnerRepo.findById(partnerId);
        if (optionalPartner.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Delivery partner not found");
        }

        DeliveryPartner partner = optionalPartner.get();

        Map<String, Object> profile = new HashMap<>();
        profile.put("fullName", partner.getFullName());
        profile.put("email", partner.getEmail());
        profile.put("phone", partner.getPhone());
        profile.put("vehicleNumber", partner.getVehicleNumber());
        profile.put("isActive", partner.isActive());
        profile.put("isAvailable", partner.isAvailable());

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String tokenHeader,
                                           @RequestBody DeliveryPartner updatedInfo) {
        String token = tokenHeader.replace("Bearer ", "");
        Long partnerId = Long.parseLong(jwtUtil.extractUserId(token));

        Optional<DeliveryPartner> optionalPartner = partnerRepo.findById(partnerId);
        if (optionalPartner.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Delivery partner not found");
        }

        DeliveryPartner existing = optionalPartner.get();
        existing.setFullName(updatedInfo.getFullName());
        existing.setEmail(updatedInfo.getEmail());
        existing.setPhone(updatedInfo.getPhone());
        existing.setVehicleNumber(updatedInfo.getVehicleNumber());

        partnerRepo.save(existing);
        return ResponseEntity.ok(existing);
    }
}
