# Next.js Hello World


This example shows the most basic idea behind Next. We have 2 pages: `src/pages/index.js` and `src/pages/about.js`. The former responds to `/` requests and the latter to `/about`. Using `next/link` you can add hyperlinks between them with universal routing capabilities.

The app in this repo is deployed at https://next-js.onrender.com.

## Payment Integration

The application supports two payment gateways based on the user's geographic location:

- **MercadoPago**: Used for users detected in Argentina
- **Stripe**: Used for all other countries (default)

### How It Works

1. **Country Detection**: When a user visits the profile/subscription page, their country is automatically detected using IP geolocation (via ipapi.co).
2. **Gateway Selection**: Based on the detected country:
   - Argentina (AR) → MercadoPago payment form
   - All other countries → Stripe Checkout redirect
3. **Fallback**: If country detection fails, the system defaults to Stripe.

### Architecture

```
src/
├── hooks/
│   └── useCountryDetection.ts    # Country detection hook with gateway selection
├── pages/profile/
│   ├── PaymentGateway.tsx        # Unified payment gateway component
│   ├── ButtonWithMercadoPagoDialog.tsx  # MercadoPago payment component
│   └── ButtonWithStripeDialog.tsx       # Stripe payment component
└── services/
    └── user.ts                   # User/subscription service
```

### Environment Variables

Configure these environment variables for payment processing:

```env
# MercadoPago (Argentina)
NEXT_PUBLIC_MERCADOPAGO_FRONTEND_KEY=your_mercadopago_public_key

# Stripe (International)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Subscription price (in cents/minor units)
NEXT_PUBLIC_PRICE=4000

# Frontend URL (for Stripe redirects)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001

# API URL (for backend communication)
NEXT_PUBLIC_API_URL=http://localhost:3000/
```

### Backend API Requirements

#### MercadoPago
The existing MercadoPago integration expects the backend to handle payment processing via:
- `POST /users/{email}/subscribe` - Process subscription with MercadoPago payment info

#### Stripe
The Stripe integration requires a backend endpoint to create Checkout sessions:

**Endpoint:** `POST /users/{email}/create-stripe-session`

**Request:**
```json
{
  "priceAmount": 4000,
  "successUrl": "http://localhost:3001/profile?payment=success",
  "cancelUrl": "http://localhost:3001/profile?payment=cancelled"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/session/..."
}
```

### Local Development & Testing

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   Copy `.env` and configure your payment gateway keys.

3. **Test Country Detection:**
   - The country detection uses ipapi.co which works based on your IP
   - For testing different countries, you can modify the `useCountryDetection.ts` hook temporarily
   - Or use a VPN to simulate different countries

4. **Test Payment Flows:**
   - **MercadoPago**: Use MercadoPago test cards (see MercadoPago docs)
   - **Stripe**: Use Stripe test cards like `4242 4242 4242 4242`

5. **Run tests:**
   ```bash
   npx jest src/hooks/useCountryDetection.test.ts
   ```

### Extending to New Countries/Gateways

The payment system is designed to be modular. To add a new payment gateway:

1. Create a new payment button component (e.g., `ButtonWithNewGatewayDialog.tsx`)
2. Update `useCountryDetection.ts` to include the new gateway type
3. Update `PaymentGateway.tsx` to render the new component based on country

Example for adding a new gateway:

```typescript
// In useCountryDetection.ts
export type PaymentGateway = 'mercadopago' | 'stripe' | 'newgateway';

const getPaymentGateway = (): PaymentGateway => {
  if (countryCode === 'AR') return 'mercadopago';
  if (countryCode === 'XX') return 'newgateway'; // New country
  return 'stripe';
};
```

## Feedback Feature

The application includes a user feedback system that allows users to send feedback from any page.

### How to Use

1. **Feedback Button**: A floating circular button with a chat icon is located in the bottom-left corner of every page.
2. **Opening the Modal**: Click the feedback button to open the feedback modal.
3. **Submitting Feedback**: 
   - Enter your feedback in the text area
   - Click "Enviar" to submit
   - You can also use Ctrl+Enter (or Cmd+Enter on Mac) to submit
4. **Closing the Modal**: Click "Cerrar" button, the X button, press ESC key, or click outside the modal

### API Integration

The feedback feature sends a POST request to the `/feedbacks` endpoint with the following format:

**Request:**
```json
{
  "message": "User feedback text here"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Feedback received"
}
```

**Configuration:**

The API endpoint URL is configured via the `NEXT_PUBLIC_API_SERVER_URL` environment variable. If not set, it defaults to `http://localhost:3000`.

### Testing the Feature Manually

1. Start the development server: `npm run dev`
2. Navigate to any page in the application
3. Click the feedback button in the bottom-left corner
4. Enter some feedback text
5. Click "Enviar" to test the submission

**Note:** Make sure the backend API endpoint is properly configured and running to receive feedback submissions.

## Deploy as Node Web Service

Click the button below to deploy this app on Render.

<a href="https://render.com/deploy" referrerpolicy="no-referrer-when-downgrade" rel="nofollow">
  <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" />
</a>

## Deploy as Static Site

1. Modify the code:
    1. In `render.yaml`, replace the definition of the service named `next-js` with the definition that is commented out.
    2. In `next.config.mjs`, uncomment the line that sets `output: "export"`.

2. Commit the code changes to your repository.

3. Click the Deploy to Render button.
