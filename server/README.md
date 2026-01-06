# Talents.MY Backend Setup Guide

This backend server handles OTP email sending using Resend.

## Prerequisites

- Node.js 18+ installed
- A Resend account (free tier: 100 emails/day)

## Setup Instructions

### 1. Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up
2. Navigate to **API Keys** section
3. Click **Create API Key**
4. Copy your API key (starts with `re_`)

### 2. Configure Environment Variables

1. Open `server/.env` file
2. Replace `re_your_api_key_here` with your actual Resend API key:
   ```
   RESEND_API_KEY=re_abc123xyz...
   ```

### 3. (Optional) Add Your Domain

By default, emails are sent from `onboarding@resend.dev`. To use your own domain:

1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `talents.my`)
3. Add the DNS records they provide
4. Once verified, update `.env`:
   ```
   FROM_EMAIL=noreply@talents.my
   ```

### 4. Install Dependencies

Already done! But if you need to reinstall:

```bash
cd server
npm install
```

### 5. Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
🚀 Talents.MY Backend running on http://localhost:3001
📧 Resend API Key: ✓ Configured
```

### 6. Start the Frontend

In a **separate terminal**:

```bash
npm run dev
```

## Testing

1. Go to `http://localhost:5173/login`
2. Enter any email address
3. Click "Send Magic Code"
4. Check your email inbox for the OTP
5. Enter the 6-digit code to log in

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/send-otp` - Send OTP to email
  - Body: `{ "email": "user@example.com" }`
- `POST /api/verify-otp` - Verify OTP code
  - Body: `{ "email": "user@example.com", "otp": "123456" }`

## Troubleshooting

### "Resend API Key: ✗ Missing"
- Make sure you've added your API key to `server/.env`
- Restart the backend server after updating `.env`

### "Network error"
- Make sure the backend server is running on port 3001
- Check if another app is using port 3001

### Emails not arriving
- Check your spam folder
- Verify your Resend API key is correct
- Check Resend dashboard for delivery logs
- Free tier limit: 100 emails/day

## Production Deployment

For production, you'll need to:
1. Deploy the backend to a hosting service (Heroku, Railway, DigitalOcean, etc.)
2. Update `VITE_API_URL` in frontend to point to your backend URL
3. Use environment variables for sensitive data
4. Consider using Redis for OTP storage instead of in-memory
