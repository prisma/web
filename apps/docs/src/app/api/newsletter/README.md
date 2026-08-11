# Newsletter API

This API endpoint subscribes public website visitors to the Prisma newsletter through Brevo.
Subscription is immediate and does not require an email confirmation.

## Setup

### 1. Get Brevo API Key

1. Log in to your [Brevo account](https://app.brevo.com/)
2. Go to **Settings** → **SMTP & API** → **API Keys**
3. Create a new API key or use an existing one
4. Copy your API key

### 2. Configure Brevo List and Template

1. In **Contacts** → **Lists**, verify that the shared helper's newsletter list ID is `15`
2. In **Transactional** → **Templates**, verify that welcome template `228` is active
3. These are verification steps; the shared server helper owns both IDs

### 3. Contact Attributes

These contact attributes must exist in **Contacts** → **Settings** → **Contact attributes**
before the routes deploy — Brevo rejects payloads that reference unknown attributes:

- `NEWSLETTER_SOURCE` (text): the path that triggered the newest (re)subscription
- `NEWSLETTER_UNSUBSCRIBE_TOKEN` (text): random token backing the unsubscribe link
- `NEWSLETTER_CONSENT_AT` (text): ISO 8601 consent timestamp, refreshed on every (re)subscription

### 4. Environment Variables

Add this variable to your Vercel project or `.env.local` file:

```bash
BREVO_API_KEY=your_api_key_here
```

### 5. Vercel Environment Variables

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

- **200**: Successfully subscribed (welcome email requested) or already subscribed
- **400**: Invalid email or missing email
- **500**: Server error or missing configuration

### Response Examples

**Success (200)**
```json
{
  "message": "Subscribed to the Prisma newsletter"
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
  "error": "A valid email address is required"
}
```

**Error (500)**
```json
{
  "error": "Newsletter service is not configured"
}
```

## Subscription Flow

Public website subscriptions use this flow:

1. The route looks up the contact in Brevo.
2. New or unsubscribed contacts are added to newsletter list `15` immediately.
3. The route sends the newsletter welcome template once when the contact enters the list.
4. Existing list members receive no additional welcome email.

Each route supplies a fixed `NEWSLETTER_SOURCE` (`website`, `blog`, or `docs`), and every
(re)subscription refreshes the `NEWSLETTER_CONSENT_AT` timestamp as consent evidence. Console signup
uses `console-signup` in a separate silent list-sync path and never calls the welcome-email helper.

## Troubleshooting

### "Newsletter service is not configured"

Check that the `BREVO_API_KEY` environment variable is set correctly.

### "Failed to subscribe"

Check the server logs for detailed error messages from Brevo. Common issues:
- Invalid API key
- Incorrect list ID in the shared newsletter helper
- Inactive or incorrect welcome template ID in the shared newsletter helper
- Brevo API rate limits

### Testing Locally

Create a `.env.local` file in the app root:

```bash
BREVO_API_KEY=your_api_key_here
```

Restart your development server after adding environment variables.

## Customization

List membership, source attribution, one-time welcome dispatch, and template selection live in
`packages/ui/src/lib/newsletter-subscription.ts`.

## CORS Configuration

The API is configured to allow requests from:
- https://prisma.io
- https://www.prisma.io

To add more origins, update the route's `allowedOrigins`.
