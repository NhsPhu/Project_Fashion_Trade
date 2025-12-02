package com.example.fashion.service;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Autowired
    private OrderService orderService;

    public PaymentIntent createPaymentIntent(Long amount, String currency, Map<String, String> metadata) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount(amount)
                        .setCurrency(currency)
                        .putAllMetadata(metadata)
                        .build();

        return PaymentIntent.create(params);
    }

    public void handleStripeEvent(String payload, String sigHeader) throws SignatureVerificationException {
        Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

        switch (event.getType()) {
            case "payment_intent.succeeded":
                PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();
                String orderId = paymentIntent.getMetadata().get("orderId");
                System.out.println("Payment for order " + orderId + " succeeded.");
                orderService.updatePaymentStatus(Long.parseLong(orderId), "PAID");
                break;
            case "payment_intent.payment_failed":
                PaymentIntent failedPaymentIntent = (PaymentIntent) event.getData().getObject();
                String failedOrderId = failedPaymentIntent.getMetadata().get("orderId");
                System.out.println("Payment for order " + failedOrderId + " failed.");
                orderService.updatePaymentStatus(Long.parseLong(failedOrderId), "PAYMENT_FAILED");
                break;
            default:
                System.out.println("Unhandled event type: " + event.getType());
        }
    }
}
