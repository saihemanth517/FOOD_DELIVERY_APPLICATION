package com.demo.service;

import org.springframework.stereotype.Service;
import com.demo.dto.FeedbackRequest;
import com.demo.model.Feedback;
import com.demo.repository.FeedbackRepository;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public Feedback saveFeedback(FeedbackRequest request, String deliveryPartnerId) {
        Feedback feedback = new Feedback();
        feedback.setOrderId(request.getOrderId());
        feedback.setRating(request.getRating());
        feedback.setFeedback(request.getFeedback());
        feedback.setDeliveryPartnerId(deliveryPartnerId);

        return feedbackRepository.save(feedback);
    }
}
