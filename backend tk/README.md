# WhatsApp AI Service Backend

A production-ready backend API for a credit-based WhatsApp AI service. This backend handles user management, credit transactions, and payment processing through Razorpay.

## Features

- ✅ User management with auto-creation (3 free credits for new users)
- ✅ Atomic credit deduction (race-condition safe)
- ✅ Complete credit transaction history
- ✅ Razorpay payment integration
- ✅ Bot API authentication
- ✅ Centralized error handling
- ✅ Production-ready code structure

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Payment Gateway**: Razorpay
- **Module System**: ES Modules

## Prerequisites

- Node.js (v14 or higher)
- Supabase account with configured database
- Razorpay account (for payments)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "backend tk"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   PORT=3000
   NODE_ENV=development
   
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   BOT_SECRET=your_secure_bot_secret_here
   
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Set up Supabase database**
   
   Ensure the following tables exist in your Supabase database:
   
   - **users**
     - `id` (uuid, primary key)
     - `phone_number` (text, unique)
     - `credits` (integer, default: 0)
     - `created_at` (timestamp)
   
   - **credit_transactions**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key to users)
     - `action` (text: 'credit' or 'debit')
     - `credits` (integer)
     - `source` (text: 'system', 'payment', 'image_generation')
     - `reference_id` (text, nullable)
     - `created_at` (timestamp)
   
   - **packages**
     - `id` (uuid, primary key)
     - `name` (text)
     - `price` (decimal/numeric)
     - `credits` (integer)

## Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in `.env`).

## API Endpoints

### Bot API Endpoints (Protected by `x-bot-secret` header)

#### 1. Get Remaining Credits
```http
GET /api/bot/credits/:phone_number
Headers:
  x-bot-secret: your_bot_secret
```

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "You have 2 credits remaining.",
  "data": {
    "remaining_credits": 2,
    "user_exists": true
  }
}
```

#### 2. Deduct Credit (After Image Generation)
```http
POST /api/bot/deduct
Headers:
  x-bot-secret: your_bot_secret
Content-Type: application/json

Body:
{
  "phone_number": "+91XXXXXXXXXX"
}
```

**Success Response:**
```json
{
  "status": "SUCCESS",
  "message": "Image generated successfully. You have 1 credit remaining.",
  "data": {
    "remaining_credits": 1
  }
}
```

**Insufficient Credits Response:**
```json
{
  "status": "INSUFFICIENT_CREDITS",
  "message": "You have no credits left. Please purchase a plan to continue.",
  "data": {
    "remaining_credits": 0
  }
}
```

### Frontend API Endpoints

#### 3. Get User Profile
```http
GET /api/users/:phone_number
```

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "User profile retrieved successfully",
  "data": {
    "id": "uuid",
    "phone_number": "+91XXXXXXXXXX",
    "credits": 5,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### 4. Get Credit History
```http
GET /api/credits/history/:user_id?limit=50
```

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Credit history retrieved successfully",
  "data": {
    "user_id": "uuid",
    "transactions": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "action": "credit",
        "credits": 10,
        "source": "payment",
        "reference_id": "pay_xxx",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 1
  }
}
```

### Payment API Endpoints

#### 5. Create Payment Order
```http
POST /api/payments/create-order
Content-Type: application/json

Body:
{
  "package_id": "uuid",
  "phone_number": "+91XXXXXXXXXX"
}
```

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Order created successfully",
  "data": {
    "order_id": "order_xxx",
    "amount": 10000,
    "currency": "INR",
    "package": {
      "id": "uuid",
      "name": "Premium Pack",
      "credits": 100,
      "price": 100
    }
  }
}
```

#### 6. Verify Payment
```http
POST /api/payments/verify
Content-Type: application/json

Body:
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "phone_number": "+91XXXXXXXXXX",
  "package_id": "uuid"
}
```

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Payment verified and credits added successfully",
  "data": {
    "payment_id": "pay_xxx",
    "order_id": "order_xxx",
    "credits_added": 100,
    "remaining_credits": 103
  }
}
```

## Project Structure

```
backend-tk/
├── src/
│   ├── config/
│   │   ├── env.js              # Environment configuration
│   │   └── supabase.js         # Supabase client setup
│   ├── controllers/
│   │   ├── bot.controller.js   # Bot API controllers
│   │   ├── user.controller.js  # User controllers
│   │   ├── credit.controller.js # Credit controllers
│   │   └── payment.controller.js # Payment controllers
│   ├── middlewares/
│   │   ├── botAuth.middleware.js # Bot authentication
│   │   └── error.middleware.js   # Error handling
│   ├── routes/
│   │   ├── bot.routes.js       # Bot API routes
│   │   ├── user.routes.js      # User routes
│   │   ├── credit.routes.js    # Credit routes
│   │   └── payment.routes.js   # Payment routes
│   ├── services/
│   │   ├── credit.service.js     # Credit business logic
│   │   └── payment.service.js  # Payment business logic
│   ├── utils/
│   │   ├── response.util.js    # Response helpers
│   │   └── logger.util.js      # Logging utility
│   ├── app.js                  # Express app configuration
│   └── server.js               # Server entry point
├── .env.example                # Environment variables template
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Key Features Explained

### Atomic Credit Deduction

The credit deduction system uses database-level atomic operations to prevent race conditions. When multiple requests try to deduct credits simultaneously, only one will succeed if credits are exactly 1.

### Auto User Creation

When a user is accessed by phone number for the first time, the system automatically:
- Creates a new user account
- Credits 3 free credits
- Logs the transaction with source = 'system'

### Payment Flow

1. Frontend calls `/api/payments/create-order` with package_id and phone_number
2. Backend creates Razorpay order and returns order_id
3. Frontend processes payment with Razorpay
4. Frontend calls `/api/payments/verify` with payment details
5. Backend verifies signature and credits user account

## Security

- **Bot API Protection**: All bot endpoints require `x-bot-secret` header
- **Environment Variables**: No secrets hardcoded in source
- **Payment Verification**: Razorpay signatures are verified before crediting accounts

## Error Handling

All errors are handled centrally through the error middleware. Responses follow a consistent format:

```json
{
  "status": "ERROR",
  "message": "Error message here"
}
```

## Development

The project uses ES Modules. Ensure Node.js version 14+ is used.

For development with auto-reload:
```bash
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Ensure all environment variables are set
3. Use a process manager like PM2:
   ```bash
   pm2 start src/server.js --name backend-api
   ```

## License

ISC
