package com.example.fashion.controller;

import com.example.fashion.service.PaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> paymentInfo) {
        try {
            Long amount = ((Number) paymentInfo.get("amount")).longValue();
            String currency = (String) paymentInfo.getOrDefault("currency", "usd");
            Map<String, String> metadata = (Map<String, String>) paymentInfo.get("metadata");


            PaymentIntent paymentIntent = paymentService.createPaymentIntent(amount, currency, metadata);

            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body("Error creating payment intent: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An internal error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/stripe/events")
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            paymentService.handleStripeEvent(payload, sigHeader);
            return ResponseEntity.ok().build();
        } catch (SignatureVerificationException e) {
            return ResponseEntity.badRequest().body("Invalid signature");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An internal error occurred: " + e.getMessage());
        }
    }
}
