# Backend API Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication](#authentication)
7. [Request & Response Flow](#request--response-flow)
8. [Credit System](#credit-system)
9. [Payment Integration](#payment-integration)
10. [Webhook Configuration](#webhook-configuration)
11. [Payment History](#payment-history)
12. [Error Handling](#error-handling)
13. [Environment Setup](#environment-setup)
14. [Deployment Guide](#deployment-guide)

---

## Project Overview

This backend API powers a credit-based WhatsApp AI service. The system manages user accounts, credits, and payments without handling image generation or WhatsApp bot logic directly. The WhatsApp bot communicates with this backend to check credits and deduct them after successful operations.

### Key Characteristics

- **Credit-based system**: Users purchase credits to use the service
- **Auto user creation**: New users receive 3 free credits automatically
- **Atomic operations**: Credit deductions are race-condition safe
- **Payment integration**: Razorpay payment gateway for credit purchases
- **Transaction logging**: All credit changes are logged for audit purposes

---

## System Architecture

### High-Level Flow

1. **User Registration Flow**
   - User accesses system via phone number
   - Backend auto-creates account if user doesn't exist
   - System credits 3 free credits automatically
   - Transaction logged with source "system"

2. **Credit Usage Flow**
   - WhatsApp bot checks user credits via API
   - If sufficient credits exist, bot processes request
   - After successful operation, bot calls deduct API
   - Credit is atomically deducted from user account
   - Transaction logged with source "image_generation"

3. **Payment Flow**
   - User selects credit package on website
   - Frontend creates Razorpay order via backend API
   - User completes payment through Razorpay
   - Backend verifies payment signature
   - Credits added to user account
   - Transaction logged with payment reference ID

### Component Interaction

- **WhatsApp Bot** ↔ **Backend API** (Bot endpoints only)
- **Website Frontend** ↔ **Backend API** (User, Credit, Payment endpoints)
- **Backend API** ↔ **Supabase** (Database operations)
- **Backend API** ↔ **Razorpay** (Payment processing)

---

## Project Structure

### Directory Organization

The project follows a clean, layered architecture pattern:

**Configuration Layer**
- Environment variables management
- Supabase client initialization
- Application-wide configuration

**Utility Layer**
- Response formatting helpers
- Logging utilities
- Shared utility functions

**Middleware Layer**
- Bot authentication middleware
- Error handling middleware
- Request validation

**Service Layer**
- Business logic for credits
- Payment processing logic
- Database interaction abstractions

**Controller Layer**
- Request handling
- Response formatting
- Input validation

**Route Layer**
- Endpoint definitions
- Route-to-controller mapping
- Route grouping

**Application Layer**
- Express app configuration
- Middleware registration
- Route mounting

**Server Layer**
- Server initialization
- Graceful shutdown handling
- Process signal management

### File Responsibilities

**Config Files**
- Load and validate environment variables
- Initialize database connections
- Set up external service clients

**Service Files**
- Contain all business logic
- Handle database transactions
- Manage external API interactions
- Ensure data consistency

**Controller Files**
- Parse and validate incoming requests
- Call appropriate service methods
- Format responses using utilities
- Handle errors appropriately

**Route Files**
- Define API endpoints
- Apply middleware (authentication, validation)
- Map routes to controllers

**Middleware Files**
- Intercept requests before controllers
- Perform authentication checks
- Handle errors globally
- Format error responses

**Utility Files**
- Provide reusable helper functions
- Standardize response formats
- Centralize logging

---

## Database Schema

### Users Table

Stores user account information and current credit balance.

**Fields:**
- Unique identifier for each user
- Phone number (unique identifier for WhatsApp integration)
- Current credit balance (integer)
- Account creation timestamp

**Key Points:**
- Phone number must be unique
- Credits default to 0 for manual creation, but system auto-creates with 3 credits
- This table is the source of truth for current credit balance

### Credit Transactions Table

Logs every credit change in the system for audit and history purposes.

**Fields:**
- Unique transaction identifier
- Reference to user who owns the transaction
- Action type (credit = adding credits, debit = removing credits)
- Number of credits involved in transaction
- Source of transaction (system, payment, image_generation)
- Reference ID (links to payment ID for payment transactions, null otherwise)
- Transaction timestamp

**Key Points:**
- Every credit change creates a new transaction record
- Used for payment history and audit trails
- Reference ID links payment transactions to Razorpay payment IDs
- Timestamps allow chronological transaction history

### Packages Table

Defines available credit packages for purchase.

**Fields:**
- Unique package identifier
- Human-readable package name
- Price in local currency (e.g., INR)
- Number of credits included in package

**Key Points:**
- Used when creating payment orders
- Determines how many credits user receives after payment
- Price stored in base currency units (will be converted to paise for Razorpay)

---

## API Endpoints

### Base URL

All API endpoints are prefixed with `/api`. The base URL structure is:

`http://your-server-domain:PORT/api`

### Endpoint Categories

**Bot Endpoints** (`/api/bot/*`)
- Require bot authentication header
- Used exclusively by WhatsApp bot
- Check and deduct credits

**User Endpoints** (`/api/users/*`)
- Public access (consider adding authentication if needed)
- Retrieve user profile information
- Display user details to frontend

**Credit Endpoints** (`/api/credits/*`)
- Public access (consider adding authentication if needed)
- Retrieve credit transaction history
- Display transaction records

**Payment Endpoints** (`/api/payments/*`)
- Public access (requires payment authentication via signature verification)
- Create Razorpay payment orders
- Verify and process payments

---

## Authentication

### Bot API Authentication

All bot endpoints require a special header for authentication. This ensures only your WhatsApp bot can access credit-checking and deduction functionality.

**Header Required:**
- Header name: `x-bot-secret`
- Value: Must match the `BOT_SECRET` environment variable
- Purpose: Prevents unauthorized access to credit management endpoints

**How It Works:**
- Every bot API request must include the `x-bot-secret` header
- Middleware intercepts requests before they reach controllers
- Header value is compared against configured bot secret
- Missing or invalid header results in 401 Unauthorized response
- Only requests with valid header proceed to controllers

**Security Notes:**
- Store bot secret in environment variables, never in code
- Use a strong, randomly generated secret
- Rotate secrets periodically for enhanced security
- Do not expose bot secret to frontend applications

### Frontend API Access

Current implementation allows public access to user and credit endpoints. For production deployments, consider:

- Adding API key authentication
- Implementing user session-based authentication
- Using OAuth or JWT tokens
- Rate limiting to prevent abuse

### Payment Verification

Payment endpoints use Razorpay's signature verification mechanism:

- Razorpay generates a signature for each payment
- Signature is based on order ID, payment ID, and secret key
- Backend verifies signature before crediting accounts
- Prevents payment fraud and unauthorized credit allocation

---

## Request & Response Flow

### Standard Request Flow

1. **Client sends HTTP request** to specific endpoint
2. **Express receives request** and matches to route
3. **Middleware executes** (authentication, validation, logging)
4. **Controller receives request** and extracts parameters
5. **Service layer processes** business logic
6. **Database operations** performed via Supabase client
7. **Response formatted** using utility helpers
8. **JSON response sent** to client

### Standard Response Format

All API responses follow a consistent structure:

**Success Response:**
- Status field: "SUCCESS"
- Message field: Human-readable success message
- Data field: Contains response payload (object, array, or null)

**Error Response:**
- Status field: "ERROR"
- Message field: Human-readable error message
- Data field: Optional additional error details (usually null)

**Custom Status Response:**
- Status field: Custom status string (e.g., "INSUFFICIENT_CREDITS")
- Message field: Description of the status
- Data field: Relevant data for the status

**HTTP Status Codes:**
- 200: Successful request
- 400: Bad request (validation errors, missing parameters)
- 401: Unauthorized (missing or invalid authentication)
- 404: Resource not found
- 500: Internal server error

### Error Handling Flow

1. **Error occurs** in any layer (service, controller, middleware)
2. **Error caught** by try-catch blocks
3. **Error logged** with details for debugging
4. **Error passed** to error handling middleware
5. **Error formatted** according to response format
6. **Error response sent** with appropriate HTTP status code

---

## Credit System

### How Credits Work

Credits are the virtual currency of the system. Users must have credits to use services. Each service request consumes one credit.

### Auto User Creation

When a phone number is accessed for the first time:

1. System checks if user exists in database
2. If user doesn't exist, new account is automatically created
3. System credits 3 free credits to new account
4. Transaction logged with source "system" and action "credit"
5. User can immediately start using the service

This ensures seamless user onboarding without manual account creation steps.

### Credit Deduction Process

Credits are deducted atomically to prevent race conditions:

1. **Pre-check**: System verifies user has at least 1 credit
2. **Atomic Update**: Database update uses conditional check (credits >= 1)
3. **Race Condition Protection**: Only one concurrent request succeeds if credits = 1
4. **Transaction Logging**: Debit transaction created with source "image_generation"
5. **Response**: Success or insufficient credits response returned

**Why Atomic Operations Matter:**
- Multiple requests may arrive simultaneously
- Without atomic operations, user could go into negative credits
- Database-level constraints ensure data integrity
- Only one request succeeds when credits are exactly 1

### Credit Addition Process

Credits are added when:

1. **New user creation**: 3 free credits from system
2. **Payment completion**: Credits purchased via Razorpay

The addition process:

1. Verify payment or system eligibility
2. Add credits to user account balance
3. Create credit transaction record
4. Log reference ID if payment-related
5. Return updated credit balance

### Credit Transaction Logging

Every credit change creates a transaction record:

- **Timestamp**: When transaction occurred
- **Action Type**: Credit (addition) or Debit (removal)
- **Amount**: Number of credits involved
- **Source**: Origin of transaction (system, payment, image_generation)
- **Reference**: Link to external system (payment ID, null for system/debit)

This creates a complete audit trail for:
- Debugging credit balance discrepancies
- Showing users their transaction history
- Accounting and financial reconciliation
- Fraud detection and prevention

---

## Payment Integration

### Razorpay Overview

Razorpay is the payment gateway handling all credit purchases. It provides secure payment processing for Indian payment methods.

### Payment Flow

**Step 1: User Selects Package**
- User browses available credit packages on website
- User selects desired package
- Frontend sends package selection to backend

**Step 2: Order Creation**
- Frontend calls create-order endpoint with package ID and phone number
- Backend retrieves package details from database
- Backend creates Razorpay order with package price (converted to paise)
- Razorpay returns order ID and order details
- Backend responds with order information to frontend

**Step 3: Payment Processing**
- Frontend displays Razorpay payment interface to user
- User enters payment details (card, UPI, wallet, etc.)
- User confirms payment
- Razorpay processes payment through banking networks

**Step 4: Payment Verification**
- Razorpay redirects user back to website with payment details
- Frontend sends payment verification request to backend
- Backend verifies Razorpay signature using crypto HMAC
- Backend retrieves package details again
- Backend credits user account with package credits
- Backend creates credit transaction with payment reference
- Backend returns success response with updated credit balance

**Step 5: Confirmation**
- Frontend displays payment success message
- User sees updated credit balance
- User can now use credits for services

### Razorpay Configuration

**Required Credentials:**
- Razorpay Key ID: Public identifier for your Razorpay account
- Razorpay Key Secret: Private key for signature verification (keep secure)

**Where to Find:**
- Log into Razorpay Dashboard
- Navigate to Settings → API Keys
- Copy Key ID and generate/retrieve Key Secret
- Store in environment variables, never in code

**Testing:**
- Razorpay provides test mode with test credentials
- Use test credentials during development
- Test mode allows payment simulation without real money
- Switch to live credentials for production

### Amount Handling

**Currency Conversion:**
- Database stores prices in base currency (e.g., 100 INR)
- Razorpay requires amounts in smallest currency unit (paise)
- Backend converts: price × 100 before creating order
- Example: ₹100 stored in DB → 10000 paise sent to Razorpay

**Why This Matters:**
- Ensures accurate payment processing
- Prevents decimal point errors
- Follows Razorpay API requirements
- Maintains precision in financial transactions

### Payment Signature Verification

Razorpay uses HMAC-SHA256 signatures to verify payment authenticity:

**Signature Generation (by Razorpay):**
- Concatenates order ID and payment ID: `order_id|payment_id`
- Creates HMAC using secret key
- Returns hexadecimal signature string

**Signature Verification (by Backend):**
- Recreates signature using same algorithm
- Compares generated signature with received signature
- Uses timing-safe comparison to prevent timing attacks
- Only credits account if signatures match

**Why Verification is Critical:**
- Prevents fake payment claims
- Ensures payment actually succeeded
- Protects against unauthorized credit allocation
- Required for financial security compliance

---

## Webhook Configuration

### What are Webhooks?

Webhooks allow Razorpay to notify your backend about payment events in real-time, even if the user doesn't return to your website after payment.

### Why Use Webhooks?

**User Never Returns:**
- User closes browser after payment
- App crashes during payment process
- Network issues interrupt payment flow
- Webhook ensures backend still receives payment notification

**Payment Status Changes:**
- Payment initially failed, later succeeds (retry by bank)
- Payment refunded by admin
- Payment disputed by user
- Webhook keeps backend synchronized with actual payment status

**Reliability:**
- Acts as backup to frontend verification
- Ensures no payments are missed
- Provides audit trail of payment events
- Enables reconciliation between systems

### Webhook Events to Handle

**payment.captured:**
- Payment successfully completed
- Credit user account
- Log transaction
- Send confirmation to user (optional)

**payment.failed:**
- Payment declined or failed
- Do not credit account
- Log failed attempt
- Notify user of failure (optional)

**payment.refunded:**
- Payment refunded by admin or user
- Debit credits previously added
- Log refund transaction
- Update user account balance

**order.paid:**
- Alternative event when order fully paid
- Similar to payment.captured
- Can use either event, but be consistent

### Webhook Setup Steps

**Step 1: Create Webhook Endpoint in Backend**

Create a new route in your backend to receive webhook POST requests. This endpoint should:

- Accept POST requests from Razorpay
- Verify webhook signature for security
- Parse webhook payload
- Process event based on event type
- Return success response to Razorpay

**Step 2: Configure Webhook in Razorpay Dashboard**

- Log into Razorpay Dashboard
- Navigate to Settings → Webhooks
- Click "Add New Webhook"
- Enter your webhook URL (e.g., `https://your-domain.com/api/webhooks/razorpay`)
- Select events to subscribe to (payment.captured, payment.failed, etc.)
- Save webhook configuration

**Step 3: Get Webhook Secret**

- Razorpay generates a webhook secret after webhook creation
- Copy webhook secret to environment variable
- Use this secret to verify webhook signatures
- Different from API key secret, specific to webhooks

**Step 4: Verify Webhook Signature**

Every webhook request includes a signature in headers. Your backend must:

- Extract signature from `X-Razorpay-Signature` header
- Recreate signature using webhook secret and request body
- Compare signatures using timing-safe comparison
- Reject requests with invalid signatures
- Only process verified webhook events

**Step 5: Process Webhook Events**

For each verified webhook event:

- Check if payment already processed (prevent duplicates)
- Verify payment amount matches expected package price
- Credit user account if payment captured
- Debit credits if payment refunded
- Log all webhook events for audit
- Return 200 OK response to Razorpay

### Webhook Security Best Practices

**Signature Verification:**
- Always verify webhook signatures
- Never process unverified webhooks
- Use webhook secret, not API key secret
- Implement timing-safe comparison

**Idempotency:**
- Check if payment already processed
- Use payment ID as unique identifier
- Prevent duplicate credit allocation
- Log duplicate webhook attempts

**Error Handling:**
- Return 200 OK even if processing fails
- Log all webhook events for debugging
- Implement retry logic for transient failures
- Monitor webhook delivery in Razorpay dashboard

**HTTPS Only:**
- Only accept webhooks over HTTPS
- Never configure webhooks with HTTP URLs
- Protect sensitive payment data in transit
- Ensure SSL certificate is valid

### Webhook Payload Structure

Razorpay sends webhook payloads in JSON format with:

- Event type (e.g., "payment.captured")
- Payment details (ID, amount, currency, status)
- Order details (ID, receipt)
- Entity information (payment entity with all fields)
- Timestamp of event

Your backend should:

- Parse JSON payload
- Extract relevant fields
- Map Razorpay data to your database schema
- Handle missing or unexpected fields gracefully

### Webhook vs Frontend Verification

Both methods work together for reliability:

**Frontend Verification (Primary):**
- User returns to website after payment
- Frontend sends verification request
- Backend verifies and credits account
- Immediate user feedback

**Webhook (Backup):**
- Razorpay notifies backend directly
- Works even if user doesn't return
- Handles edge cases and failures
- Ensures no payments missed

**Best Practice:**
- Use frontend verification as primary method
- Use webhook as backup/confirmation
- Check if payment already processed before crediting
- Both methods should result in same outcome

---

## Payment History

### What is Payment History?

Payment history shows users a chronological record of all credit transactions in their account. This includes free credits, purchases, and usage.

### Transaction Types in History

**System Credits:**
- When: New user account creation
- Amount: 3 credits
- Source: "system"
- Reference: null
- Purpose: Welcome bonus for new users

**Payment Credits:**
- When: Successful payment completion
- Amount: Based on purchased package
- Source: "payment"
- Reference: Razorpay payment ID
- Purpose: Credits purchased by user

**Usage Debits:**
- When: User consumes service (image generation)
- Amount: 1 credit per usage
- Source: "image_generation"
- Reference: null
- Purpose: Service consumption deduction

### Retrieving Payment History

**Endpoint:** Credit history endpoint allows retrieval of transaction records

**Parameters:**
- User ID: Unique identifier of user account
- Limit: Maximum number of transactions to return (default: 50, max recommended: 100)

**Response Includes:**
- All transaction fields (ID, action, credits, source, reference, timestamp)
- Chronologically ordered (newest first)
- Pagination support via limit parameter

**Use Cases:**
- Display transaction list on user dashboard
- Show credit usage patterns
- Provide payment receipts
- Enable account reconciliation
- Support customer service inquiries

### History Display Considerations

**For Users:**
- Show clear action labels (Received, Used, Purchased)
- Display timestamps in user-friendly format
- Highlight payment transactions with payment IDs
- Show running credit balance if needed
- Group by date for better readability

**For Admins:**
- Include all transaction details
- Link payment transactions to Razorpay dashboard
- Export transaction data for accounting
- Filter by transaction type or date range
- Generate reports on credit flow

### Linking to Payments

Payment transactions include Razorpay payment IDs in the reference field:

- Payment ID format: `pay_xxxxxxxxxxxxx`
- Can be used to look up payment in Razorpay dashboard
- Enables troubleshooting payment issues
- Supports refund processing
- Provides payment audit trail

**How to Use Payment ID:**
- Copy payment ID from transaction history
- Log into Razorpay Dashboard
- Search for payment using payment ID
- View full payment details and status
- Process refunds if necessary

---

## Error Handling

### Error Response Format

All errors follow consistent response structure:

- Status field: "ERROR" or specific error status
- Message field: Human-readable error description
- Data field: Optional additional error context
- HTTP Status Code: Appropriate status code (400, 401, 404, 500)

### Error Types

**Validation Errors:**
- Missing required parameters
- Invalid parameter formats
- Business rule violations
- HTTP Status: 400 Bad Request

**Authentication Errors:**
- Missing authentication header
- Invalid authentication credentials
- Expired authentication tokens
- HTTP Status: 401 Unauthorized

**Not Found Errors:**
- User not found
- Package not found
- Resource doesn't exist
- HTTP Status: 404 Not Found

**Server Errors:**
- Database connection failures
- External API failures
- Unexpected application errors
- HTTP Status: 500 Internal Server Error

### Error Handling Strategy

**Client-Side:**
- Check response status field
- Display user-friendly error messages
- Handle specific error cases appropriately
- Log errors for debugging
- Retry transient failures

**Server-Side:**
- Log all errors with full context
- Never expose sensitive information
- Return generic messages in production
- Include detailed messages in development
- Monitor error rates and patterns

### Common Error Scenarios

**Insufficient Credits:**
- Status: "INSUFFICIENT_CREDITS"
- Message: Indicates user has no credits
- Action: Prompt user to purchase credits
- Data: Current credit balance (0)

**Payment Verification Failed:**
- Status: "ERROR"
- Message: Payment signature invalid
- Action: Do not credit account, request retry
- Security: Prevents fraudulent credit claims

**User Not Found:**
- Status: Usually not returned (auto-creation)
- Message: User not found (if auto-creation disabled)
- Action: Create user account or request registration

**Database Errors:**
- Status: "ERROR"
- Message: Generic server error message
- Logging: Detailed error logged server-side
- Action: Retry request or contact support

---

## Environment Setup

### Required Environment Variables

**Server Configuration:**
- Port number for HTTP server
- Node environment (development/production)

**Database Configuration:**
- Supabase project URL
- Supabase service role key (for server-side operations)

**Security Configuration:**
- Bot secret for WhatsApp bot authentication
- Strong, randomly generated value

**Payment Configuration:**
- Razorpay Key ID (public identifier)
- Razorpay Key Secret (private key for signatures)

**Optional: Webhook Configuration:**
- Webhook secret for Razorpay webhooks
- Only needed if implementing webhook endpoint

### Environment File Structure

Create `.env` file in project root with all required variables. Do not commit this file to version control. Use `.env.example` as template.

### Environment Validation

Backend validates all required environment variables at startup:

- Missing variables cause server startup failure
- Error message lists all missing variables
- Prevents runtime errors from missing configuration
- Ensures all services properly configured

### Security Best Practices

**Never Commit Secrets:**
- Add `.env` to `.gitignore`
- Use `.env.example` for documentation
- Use environment variables in production
- Rotate secrets periodically

**Use Different Secrets per Environment:**
- Development environment: Test/dummy secrets
- Production environment: Real, secure secrets
- Never share secrets between environments
- Use secret management services in production

---

## Deployment Guide

### Pre-Deployment Checklist

**Environment Configuration:**
- All environment variables set correctly
- Production secrets configured
- Database connection verified
- External service credentials tested

**Database Setup:**
- All required tables created
- Table schemas match application expectations
- Indexes created for performance
- Sample data loaded if needed

**Security Configuration:**
- Strong bot secret generated
- Razorpay credentials are production keys
- HTTPS configured for webhook endpoints
- CORS configured for allowed origins

### Deployment Steps

**Step 1: Server Setup**
- Provision server with Node.js runtime
- Set up process manager (PM2, systemd, etc.)
- Configure firewall rules
- Set up SSL certificates

**Step 2: Code Deployment**
- Clone or deploy code to server
- Install dependencies via npm install
- Copy environment file with production values
- Verify file permissions

**Step 3: Database Connection**
- Ensure server can reach Supabase
- Test database connection
- Verify service role key has correct permissions
- Test sample queries

**Step 4: External Services**
- Configure Razorpay production keys
- Test payment order creation
- Verify payment signature verification
- Set up webhook endpoint (if using)

**Step 5: Application Start**
- Start application using process manager
- Verify server starts without errors
- Check health endpoint responds
- Monitor application logs

**Step 6: Testing**
- Test all API endpoints
- Verify bot authentication works
- Test payment flow end-to-end
- Verify credit deduction works
- Check error handling

### Production Considerations

**Monitoring:**
- Set up application monitoring
- Monitor error rates and logs
- Track API response times
- Alert on critical failures

**Scaling:**
- Use load balancer for multiple instances
- Ensure database can handle load
- Implement rate limiting if needed
- Monitor resource usage

**Backup:**
- Regular database backups
- Backup environment configuration
- Document recovery procedures
- Test backup restoration

**Security:**
- Regular security updates
- Monitor for vulnerabilities
- Implement rate limiting
- Use HTTPS for all connections
- Regularly rotate secrets

### Health Monitoring

**Health Check Endpoint:**
- Simple endpoint returning server status
- Use for load balancer health checks
- Monitor server availability
- Quick server status verification

**Recommended Monitoring:**
- Server uptime
- API response times
- Error rates by endpoint
- Database connection status
- Payment success rates

---

## Integration Guide

### WhatsApp Bot Integration

**Connecting Bot to Backend:**
- Configure bot to call backend API endpoints
- Set bot secret in bot configuration
- Use bot secret in x-bot-secret header for all requests
- Handle API responses appropriately

**Credit Check Flow:**
- Bot calls get-credits endpoint before processing
- Receives remaining credits count
- Allows or denies request based on credits
- Informs user of credit status

**Credit Deduction Flow:**
- Bot processes user request (image generation)
- On success, calls deduct endpoint
- Receives updated credit balance
- Confirms deduction to user

**Error Handling:**
- Handle insufficient credits response
- Handle API errors gracefully
- Retry transient failures
- Log errors for debugging

### Website Frontend Integration

**User Profile Display:**
- Call get-user endpoint with phone number
- Display user information and credit balance
- Update display after credit changes
- Handle user not found cases

**Payment Integration:**
- Display available packages from database
- Call create-order endpoint on package selection
- Integrate Razorpay checkout with order ID
- Handle payment completion callback
- Call verify-payment endpoint with payment details
- Update credit display after verification

**Transaction History:**
- Call credit-history endpoint with user ID
- Display chronological transaction list
- Format timestamps for readability
- Show transaction types and amounts
- Link payment transactions to Razorpay

**Error Handling:**
- Display user-friendly error messages
- Handle network errors
- Implement retry logic for failed requests
- Show loading states during API calls

### API Client Examples

**HTTP Client Setup:**
- Use axios, fetch, or similar HTTP client
- Set base URL to backend server
- Configure request timeout
- Set default headers if needed

**Bot API Requests:**
- Include x-bot-secret header in all requests
- Use GET for credit checks
- Use POST for credit deduction
- Parse JSON responses

**Frontend API Requests:**
- No special headers required (unless authentication added)
- Use appropriate HTTP methods
- Send JSON in request body for POST requests
- Handle CORS if calling from browser

---

## Project Flow Summary

### New User Journey

1. User accesses service via WhatsApp bot with phone number
2. Backend checks user existence
3. Backend creates user account (if new)
4. Backend credits 3 free credits
5. Backend logs system credit transaction
6. User receives confirmation and can use service

### Credit Usage Journey

1. User requests service via WhatsApp bot
2. Bot checks user credits via backend API
3. Backend returns credit balance
4. Bot allows request if credits available
5. Bot processes service request
6. Bot calls deduct endpoint on success
7. Backend atomically deducts 1 credit
8. Backend logs debit transaction
9. Backend returns updated credit balance
10. Bot confirms service completion to user

### Payment Purchase Journey

1. User visits website and browses packages
2. User selects credit package
3. Frontend calls create-order endpoint
4. Backend creates Razorpay order
5. Backend returns order details
6. Frontend displays Razorpay checkout
7. User completes payment
8. Razorpay processes payment
9. Frontend calls verify-payment endpoint
10. Backend verifies payment signature
11. Backend retrieves package details
12. Backend credits user account
13. Backend logs payment transaction
14. Backend returns updated balance
15. Frontend displays success message

### Credit History Journey

1. User requests transaction history on website
2. Frontend calls credit-history endpoint with user ID
3. Backend queries credit transactions table
4. Backend filters by user ID
5. Backend orders by timestamp (newest first)
6. Backend applies limit if specified
7. Backend returns transaction array
8. Frontend displays formatted transaction list

---

## Key Concepts Explained

### Atomic Operations

Atomic operations ensure database updates either fully succeed or fully fail, with no partial states. This is critical for credit deductions to prevent race conditions where multiple simultaneous requests could result in incorrect credit balances.

### Race Condition Safety

When multiple requests try to deduct credits simultaneously, only one should succeed if credits equal exactly 1. Database-level conditional updates ensure this by checking credit balance before allowing deduction.

### Transaction Logging

Every credit change creates a permanent record in the transactions table. This provides complete audit trail, enables transaction history, and helps resolve any credit balance discrepancies.

### Signature Verification

Payment signatures use cryptographic hashing to prove payment authenticity. Only Razorpay can generate valid signatures using the secret key, preventing fraudulent credit claims.

### Service Layer Pattern

Business logic is separated into service files, keeping controllers thin and focused on HTTP concerns. This improves testability, reusability, and maintainability of the codebase.

---

## Support and Troubleshooting

### Common Issues

**Connection Errors:**
- Verify Supabase URL and credentials
- Check network connectivity
- Verify firewall rules
- Test database connection independently

**Authentication Failures:**
- Verify bot secret matches in bot and backend
- Check x-bot-secret header is included
- Ensure header name is exactly "x-bot-secret"
- Verify environment variables are loaded

**Payment Failures:**
- Verify Razorpay credentials are correct
- Check payment signature verification logic
- Ensure amounts are in correct currency units
- Review Razorpay dashboard for payment status

**Credit Balance Issues:**
- Check transaction history for discrepancies
- Verify all transactions are logged
- Review credit deduction logic for race conditions
- Check for duplicate payment processing

### Debugging Tips

**Enable Detailed Logging:**
- Set NODE_ENV to development
- Review application logs for errors
- Check database query logs
- Monitor API request/response logs

**Test Endpoints Individually:**
- Use Postman or curl for endpoint testing
- Verify each endpoint separately
- Test with sample data
- Check responses match expected format

**Database Queries:**
- Directly query Supabase to verify data
- Check user credits match expectations
- Review transaction records
- Verify package data is correct

### Getting Help

**Documentation:**
- Review this documentation thoroughly
- Check README.md for setup instructions
- Review code comments for implementation details

**Logs:**
- Application logs show detailed error information
- Database logs show query execution
- Payment logs in Razorpay dashboard

**Support Channels:**
- Review error messages carefully
- Check external service status pages
- Contact service providers (Razorpay, Supabase) for service-specific issues

---

## Conclusion

This backend API provides a robust, scalable foundation for a credit-based WhatsApp AI service. By following this documentation, you can integrate the backend with your WhatsApp bot and website frontend, configure payments, and deploy to production.

Key takeaways:

- **Structure**: Clean separation of concerns across layers
- **Security**: Authentication and signature verification protect the system
- **Reliability**: Atomic operations ensure data consistency
- **Auditability**: Complete transaction logging enables transparency
- **Scalability**: Architecture supports growth and additional features

For implementation details, refer to the source code comments and API endpoint definitions in the codebase.
