
package com.fooddelivery.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.model.User;
import com.fooddelivery.repo.UserRepository;
import com.fooddelivery.service.ExcelRService;
import com.fooddelivery.util.JwtUtil;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ExcelRController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private ExcelRService excelRService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	// Google OAuth login/register endpoint
@PostMapping("/auth/google")
public ResponseEntity<Map<String, String>> googleAuth(@RequestBody Map<String, String> payload) {
	try {
		String credential = payload.get("credential");
		// Decode JWT (Google ID token) to extract email and name
		String[] parts = credential.split("\\.");
		if (parts.length != 3) throw new IllegalArgumentException("Invalid JWT");
		String bodyJson = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
		com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
		@SuppressWarnings("unchecked")
		Map<String, Object> body = mapper.readValue(bodyJson, Map.class);
		String email = (String) body.get("email");
		String name = (String) body.get("name");

		if (email == null || email.isEmpty()) throw new IllegalArgumentException("No email in Google token");

		Optional<User> userOpt = userRepository.findByUsername(email);
		User user;
		if (userOpt.isPresent()) {
			user = userOpt.get();
		} else {
			user = new User();
			user.setUsername(email);
			user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString())); // random password
			user.setRole("ROLE_CUSTOMER"); // default role
			user.setName(name);
			userRepository.save(user);
		}
		// Always update name if changed
		if (name != null && (user.getName() == null || !user.getName().equals(name))) {
			user.setName(name);
			userRepository.save(user);
		}
		String token = jwtUtil.generateToken(email);
		Map<String, String> response = new HashMap<>();
		response.put("login", "success");
		response.put("token", token);
		response.put("role", user.getRole());
		response.put("username", user.getUsername());
		response.put("name", user.getName());
		return ResponseEntity.ok(response);
	} catch (Exception e) {
		Map<String, String> response = new HashMap<>();
		response.put("login", "fail");
		response.put("error", e.getMessage());
		return ResponseEntity.status(401).body(response);
	}
}
	// FILE: ExcelRController.java (Only login() method shown here for brevity)
	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {
		String username = loginData.get("username");
		String password = loginData.get("password");

		Optional<User> user = userRepository.findByUsername(username);

		if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
			Map<String, String> response = new HashMap<>();
			String token = jwtUtil.generateToken(username);
			response.put("login", "success");
			response.put("token", token);
			response.put("role", user.get().getRole());
			return ResponseEntity.ok(response);
		} else {
			Map<String, String> response1 = new HashMap<>();
			response1.put("login", "fail");
			return ResponseEntity.status(401).body(response1);
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody User user) {
		try {
			User saved = excelRService.saveUser(user);
			return ResponseEntity.ok(Map.of("message", "Registration Success", "id", saved.getId()));
		} catch (Exception e) {
			return ResponseEntity.status(400).body(Map.of("message", "Registration Failed", "error", e.getMessage()));
		}
	}
}
