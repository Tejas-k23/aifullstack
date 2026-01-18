# Razorpay Integration Guide

This guide explains how to integrate Razorpay payment gateway into your Node.js backend application.

## Prerequisites

1. **Razorpay Account**: Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **API Keys**: Get your Key ID and Key Secret from the Dashboard
3. **Webhook Secret**: Generate a webhook secret for secure webhook verification

## Environment Setup

Add the following environment variables to your `.env` file:

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

## Installation

Install the Razorpay Node.js SDK:

```bash
npm install razorpay
```

## Code Structure

The integration consists of the following components:

### 1. Environment Configuration (`src/config/env.js`)

Update your config to include Razorpay settings:

```javascript
export default {
  // ... other config
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
  }
};
```

### 2. Payment Service (`src/services/payment.service.js`)

This service handles Razorpay API interactions:

```javascript
import Razorpay from 'razorpay';
import crypto from 'crypto';
import config from '../config/env.js';

// Initialize Razorpay
export const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret
});

// Create order
export const createOrder = async (amount, currency = 'INR', options = {}) => {
  const orderData = {
    amount: Math.round(amount), // Amount in paise
    currency,
    receipt: options.receipt || `receipt_${Date.now()}`,
    notes: options.notes || {}
  };
  
  return await razorpay.orders.create(orderData);
};

// Verify payment signature
export const verifyPayment = (orderId, paymentId, signature) => {
  const hmac = crypto.createHmac('sha256', config.razorpay.keySecret);
  hmac.update(`${orderId}|${paymentId}`);
  const expectedSignature = hmac.digest('hex');
  
  return expectedSignature === signature;
};

// Verify webhook signature
export const verifyWebhook = (rawBody, signature) => {
  const hmac = crypto.createHmac('sha256', config.razorpay.webhookSecret);
  hmac.update(rawBody);
  const expectedSignature = hmac.digest('hex');
  
  return expectedSignature === signature;
};
```

### 3. Payment Controller (`src/controllers/payment.controller.js`)

Handles payment endpoints:

```javascript
import { createOrder, verifyPayment, verifyWebhook } from '../services/payment.service.js';
import { addCredits } from '../services/credit.service.js';
import { supabase } from '../config/supabase.js';

// Create payment order
export const createPaymentOrder = async (req, res) => {
  const { package_id, phone_number } = req.body;
  
  // Fetch package details
  const { data: packageData } = await supabase
    .from('packages')
    .select('*')
    .eq('id', package_id)
    .single();
  
  // Create Razorpay order
  const order = await createOrder(packageData.price * 100, 'INR', {
    receipt: `receipt_${Date.now()}_${package_id}`,
    notes: {
      package_id,
      phone_number,
      credits: packageData.credits
    }
  });
  
  res.json({
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    package: packageData
  });
};

// Verify payment
export const verifyPaymentOrder = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, phone_number, package_id } = req.body;
  
  const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid payment signature' });
  }
  
  // Add credits to user
  const updatedUser = await addCredits(phone_number, packageData.credits, 'payment', razorpay_payment_id);
  
  res.json({
    payment_id: razorpay_payment_id,
    credits_added: packageData.credits,
    remaining_credits: updatedUser.credits
  });
};

// Handle webhooks
export const handleWebhook = async (req, res) => {
  const rawBody = req.body;
  const signature = req.headers['x-razorpay-signature'];
  
  const isValid = verifyWebhook(rawBody, signature);
  
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }
  
  const event = JSON.parse(rawBody.toString());
  
  if (event.event === 'payment.captured') {
    const paymentEntity = event.payload.payment.entity;
    const order = await razorpay.orders.fetch(paymentEntity.order_id);
    
    const { package_id, phone_number, credits } = order.notes;
    
    await addCredits(phone_number, parseInt(credits), 'webhook_payment', paymentEntity.id);
  }
  
  res.status(200).json({ status: 'ok' });
};
```

### 4. Payment Routes (`src/routes/payment.routes.js`)

Define the API endpoints:

```javascript
import express from 'express';
import { createPaymentOrder, verifyPaymentOrder, handleWebhook } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPaymentOrder);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
```

### 5. App Configuration (`src/app.js`)

Ensure routes are mounted:

```javascript
import paymentRoutes from './routes/payment.routes.js';

// ... other middleware

app.use('/api/payments', paymentRoutes);
```

## Frontend Integration

### 1. Load Razorpay Checkout Script

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2. Initialize Payment

```javascript
const initializePayment = async (packageId, phoneNumber) => {
  // Create order from backend
  const response = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ package_id: packageId, phone_number: phoneNumber })
  });
  
  const orderData = await response.json();
  
  // Initialize Razorpay checkout
  const options = {
    key: 'YOUR_RAZORPAY_KEY_ID', // From environment
    amount: orderData.amount,
    currency: orderData.currency,
    order_id: orderData.order_id,
    name: 'Your App Name',
    description: `Purchase ${orderData.package.name}`,
    handler: async function (response) {
      // Verify payment on backend
      const verifyResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          phone_number: phoneNumber,
          package_id: packageId
        })
      });
      
      const result = await verifyResponse.json();
      console.log('Payment verified:', result);
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
};
```

## Webhook Setup

1. **Configure Webhook URL**: In Razorpay Dashboard, set the webhook URL to:
   ```
   https://yourdomain.com/api/payments/webhook
   ```

2. **Select Events**: Enable `payment.captured` event

3. **Local Testing**: Use ngrok to expose your local server:
   ```bash
   npm install -g ngrok
   ngrok http 3000
   ```

## Testing

### Test Mode
Use Razorpay's test keys for development. Test cards are available in their documentation.

### API Testing
```bash
# Create order
curl -X POST http://localhost:3000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"package_id": 1, "phone_number": "1234567890"}'

# Verify payment (use test payment IDs)
curl -X POST http://localhost:3000/api/payments/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_test_id",
    "razorpay_payment_id": "pay_test_id", 
    "razorpay_signature": "test_signature",
    "phone_number": "1234567890",
    "package_id": 1
  }'
```

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **Signature Verification**: Always verify payment and webhook signatures
3. **HTTPS**: Use HTTPS in production for webhook endpoints
4. **Idempotency**: Implement checks to prevent duplicate credit additions

## Troubleshooting

### Common Issues

1. **Invalid Signature**: Ensure correct key secret and signature format
2. **Webhook Not Received**: Check firewall, HTTPS, and webhook URL
3. **Order Creation Fails**: Verify API keys and amount format (paise for INR)

### Logs
Check your application logs for detailed error messages and payment processing status.

## Support

- [Razorpay Documentation](https://docs.razorpay.com/)
- [Razorpay Support](https://razorpay.com/support/)</content>
<parameter name="filePath">c:\Users\Tejas\Videos\backend tk\RAZORPAY_INTEGRATION.md