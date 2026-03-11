# Newsletter API

This API endpoint handles newsletter subscriptions via Brevo (formerly Sendinblue) with double opt-in.

## Setup

### 1. Get Brevo API Key

1. Log in to your [Brevo account](https://app.brevo.com/)
2. Go to **Settings** → **SMTP & API** → **API Keys**
3. Create a new API key or use an existing one
4. Copy your API key

### 2. Configure Brevo List and Template

1. Go to **Contacts** → **Lists** and note your list ID (default is `15`)
2. Go to **Campaigns** → **Templates** and create a double opt-in template
3. Note your template ID (default is `36`)

### 3. Environment Variables

Add this variable to your Vercel project or `.env.local` file:

```bash
BREVO_API_KEY=your_api_key_here
```

### 4. Vercel Environment Variables

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add `BREVO_API_KEY`
3. Make sure it's available for all environments (Production, Preview, Development)

## Usage

The newsletter form is available through the `FooterNewsletterForm` component:

```tsx
import { FooterNewsletterForm } from "@prisma-docs/ui/components/newsletter";

export default function Page() {
  return <FooterNewsletterForm blog={false} />;
}
```

## API Endpoint

**POST** `/api/newsletter`

### Request Body

```json
{
  "email": "user@example.com"
}
```

### Response Codes

- **200**: Successfully added to list (confirmation email sent) or already subscribed
- **400**: Invalid email or missing email
- **500**: Server error or missing configuration

### Response Examples

**Success (200)**
```json
{
  "message": "Please check your email to confirm subscription"
}
```

**Already Subscribed (200)**
```json
{
  "message": "Already subscribed",
  "alreadySubscribed": true
}
```

**Error (400)**
```json
{
  "error": "Invalid email address"
}
```

**Error (500)**
```json
{
  "error": "Newsletter service is not configured"
}
```

## Double Opt-In

This implementation uses Brevo's double opt-in feature:

1. User submits their email
2. Brevo sends a confirmation email using the configured template
3. User clicks the confirmation link
4. Subscription is confirmed and user is redirected to https://prisma.io

This ensures compliance with GDPR and other privacy regulations.

## Troubleshooting

### "Newsletter service is not configured"

Check that the `BREVO_API_KEY` environment variable is set correctly.

### "Failed to subscribe"

Check the server logs for detailed error messages from Brevo. Common issues:
- Invalid API key
- Incorrect list ID (update line 60 in route.ts if different from `15`)
- Incorrect template ID (update line 61 in route.ts if different from `36`)
- Brevo API rate limits

### Development Mode Debug Info

In development mode (`NODE_ENV=development`), the API will return additional debug information in the error response:

```json
{
  "error": "Failed to subscribe. Please try again later.",
  "debug": {
    "status": 400,
    "brevoError": {
      "code": "invalid_parameter",
      "message": "..."
    }
  }
}
```

Check the browser console for "API Error Debug:" logs.

### Testing Locally

Create a `.env.local` file in the app root:

```bash
BREVO_API_KEY=your_api_key_here
```

Restart your development server after adding environment variables.

## Customization

To customize the list ID or template ID, edit the API route:

```typescript
// In route.ts, around line 60-61
includeListIds: [15],  // Change to your list ID
templateId: 36,        // Change to your template ID
```

## CORS Configuration

The API is configured to allow requests from:
- https://prisma.io
- https://www.prisma.io
- https://prisma.io/docs

To add more origins, update the `corsHeaders` in `route.ts`.