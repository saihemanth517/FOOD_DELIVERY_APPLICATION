package com.demo.controller;

import com.demo.dto.FeedbackRequest;
import com.demo.model.Feedback;
import com.demo.service.FeedbackService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackRequest request) {
        String deliveryPartnerId = SecurityContextHolder.getContext().getAuthentication().getName();

        if (request.getOrderId() == null || request.getOrderId().isBlank()) {
            return ResponseEntity.badRequest().body("Order ID is required.");
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5.");
        }

        Feedback saved = feedbackService.saveFeedback(request, deliveryPartnerId);
        return ResponseEntity.ok(saved);
    }
    
    
}
