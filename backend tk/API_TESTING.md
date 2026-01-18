# API Testing Guide

Quick reference for testing endpoints in Postman, Insomnia, or curl.

## Base URL
```
http://localhost:3000
```

## Bot Routes (Requires Authentication)

All bot routes require `x-bot-secret` header. Add this header in Postman/Insomnia or set as environment variable.

### 1. Get User Credits
**GET** `/api/bot/credits/:phone_number`

**Headers:**
```
x-bot-secret: <your-bot-secret>
```
**Example:**
```
GET http://localhost:3000/api/bot/credits/+1234567890
```all test

**Response (200 OK):**
```jsonn
{
  "status": "SUCCESS",
  "message": "You have 3 credits remaining.",
  "data": {
    "remaining_credits": 3,
    "user_exists": true
  }
}
```

### 2. Deduct Credit
**POST** `/api/bot/deduct`

**Headers:**
```
x-bot-secret: <your-bot-secret>
Content-Type: application/json
```

**Body:**
```json
{
  "phone_number": "+1234567890"
}
```

**Response (200 OK - Success):**
```json
{
  "status": "SUCCESS",
  "message": "Image generated successfully. You have 2 credits remaining.",
  "data": {
    "remaining_credits": 2
  }
}
```

**Response (200 OK - Insufficient Credits):**
```json
{
  "status": "INSUFFICIENT_CREDITS",
  "message": "You have no credits left. Please purchase a plan to continue.",
  "data": {
    "remaining_credits": 0
  }
}
```

---

## Credit Routes (No Authentication Required)

### 3. Get Credit History
**GET** `/api/credits/history/:user_id?limit=50`

**Example:**
```
GET http://localhost:3000/api/credits/history/123e4567-e89b-12d3-a456-426614174000?limit=10
```

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 50)

**Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Credit history retrieved successfully",
  "data": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "transactions": [...],
    "total": 5
  }
}
```

---

## User Routes (No Authentication Required)

### 4. Get User Profile
**GET** `/api/users/:phone_number`

**Example:**
```
GET http://localhost:3000/api/users/+1234567890
```

**Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "User profile retrieved successfully",
  "data": {
    "id": "...",
    "phone_number": "+1234567890",
    "credits": 3,
    "created_at": "..."
  }
}
```

---

## Payment Routes (No Authentication Required)

### 5. Create Payment Order
**POST** `/api/payments/create-order`

**Body:**
```json
{
  "amount": 100,
  "currency": "INR",
  "phone_number": "+1234567890"
}
```

**Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Order created successfully",
  "data": {
    "order_id": "...",
    "amount": 100,
    "currency": "INR"
  }
}
```

### 6. Verify Payment Order
**POST** `/api/payments/verify`

**Body:**
```json
{
  "razorpay_order_id": "...",
  "razorpay_payment_id": "...",
  "razorpay_signature": "...",
  "phone_number": "+1234567890"
}
```

**Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Payment verified and credits added successfully",
  "data": {
    "credits_added": 10,
    "remaining_credits": 13
  }
}
```

---

## Testing with curl

### Get Credits
```bash
curl -X GET "http://localhost:3000/api/bot/credits/+1234567890" \
  -H "x-bot-secret: <your-bot-secret>"
```

### Deduct Credit
```bash
curl -X POST "http://localhost:3000/api/bot/deduct" \
  -H "x-bot-secret: <your-bot-secret>" \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+1234567890"}'
```

### Get Credit History
```bash
curl -X GET "http://localhost:3000/api/credits/history/USER_ID?limit=10"
```

---

## Postman Collection Setup

1. Create environment variable `base_url` = `http://localhost:3000`
2. Create environment variable `bot_secret` = `<your-bot-secret>`
3. For bot routes, add header: `x-bot-secret` = `{{bot_secret}}`
4. Use `{{base_url}}` prefix for all URLs
