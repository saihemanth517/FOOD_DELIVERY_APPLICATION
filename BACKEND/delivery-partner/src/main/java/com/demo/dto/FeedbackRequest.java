package com.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class FeedbackRequest {
    private String orderId;
    private int rating;
    @JsonProperty("comments")
    private String feedback;
}
