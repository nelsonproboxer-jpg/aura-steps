# Aura Steps — order confirmation email

A Cloudflare Worker that sends the branded order-confirmation email from
`support@aurastepsusa.com` via Resend. The storefront POSTs the order to the
Worker; the Worker holds the secret Resend key (never exposed in the website).

## Setup

### 1. Resend (email delivery)
1. Sign up at https://resend.com (free — 3,000 emails/month).
2. **Domains → Add Domain → `aurastepsusa.com`**, then add the DNS records
   Resend shows (SPF/DKIM on a `send` subdomain — does not clash with Zoho).
3. **API Keys → Create** → copy the `re_…` key.

### 2. Cloudflare Worker (secure sender)
1. Sign up at https://dash.cloudflare.com (free).
2. **Workers & Pages → Create → Create Worker** → name it `aura-email` → Deploy.
3. **Edit code** → paste the contents of `worker.js` → Deploy.
4. **Settings → Variables and Secrets → Add:**
   - `RESEND_API_KEY` = your `re_…` key  (type: Secret)
   - `MERCHANT_EMAIL` = `support@aurastepsusa.com`  (optional — sends you a copy)
5. Copy the Worker URL (e.g. `https://aura-email.<you>.workers.dev`).

### 3. Wire the storefront
Set that Worker URL as `ORDER_EMAIL_WORKER` in `assets/data.js` and the
checkout will call it on every completed order.
