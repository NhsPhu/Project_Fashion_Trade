const PaymentService = {
    createPaymentIntent: async (paymentData) => {
        // This function calls the backend to create a Stripe PaymentIntent
        const response = await fetch('/api/payment/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create payment intent');
        }

        return response.json();
    },
};

export default PaymentService;
