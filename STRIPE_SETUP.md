# Stripe Integration Setup Guide

This guide will help you set up Stripe billing for the Form Builder SaaS.

## 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com) and create an account
2. Complete the account verification process

## 2. Get API Keys

1. Navigate to **Developers** → **API keys** in your Stripe Dashboard
2. Copy your **Secret key** (starts with `sk_test_` for test mode)
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Add them to your `.env` file:
   ```env
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

## 3. Create Products and Prices

### Basic Plan (All users start here with 14-day trial)

1. Go to **Products** → **Add product**
2. Create a product named "Basic"
3. Add two prices:
   - **Monthly**: $19/month (recurring)
   - **Yearly**: $199/year (recurring)
4. **IMPORTANT**: Enable free trial on each price (14 days)
5. Copy the Price IDs and add to `.env`:
   ```env
   STRIPE_BASIC_MONTHLY_PRICE_ID="price_..."
   STRIPE_BASIC_YEARLY_PRICE_ID="price_..."
   ```

### Pro Plan

1. Create another product named "Pro"
2. Add two prices:
   - **Monthly**: $47/month (recurring)
   - **Yearly**: $470/year (recurring)
3. **IMPORTANT**: Enable free trial on each price (14 days)
4. Copy the Price IDs and add to `.env`:
   ```env
   STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
   STRIPE_PRO_YEARLY_PRICE_ID="price_..."
   ```

## 4. Configure Webhooks

### For Development (using Stripe CLI)

1. Install Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret (starts with `whsec_`) and add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

### For Production

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Set endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
3. Select the following events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`
4. Copy the **Signing secret** and add to your production `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

## 5. Enable Customer Portal

1. Go to **Settings** → **Billing** → **Customer portal**
2. Click **Activate** to enable the customer portal
3. Configure settings:
   - ✅ Allow customers to update payment methods
   - ✅ Allow customers to cancel subscriptions
   - ✅ Allow customers to view invoices
   - Configure cancellation behavior (immediate or end of period)

## 6. Test the Integration

### Test Cards

Use these test cards in Stripe test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

### Testing Flow

1. Create a new user account
2. Navigate to `/pricing`
3. Select a plan and complete checkout
4. Verify subscription in Stripe Dashboard
5. Check `/billing` page to see subscription details
6. Test submission limits
7. Test Customer Portal via `/billing` → "Manage Subscription"

## 7. Migrate Existing Users

After setting up Stripe, migrate existing users to the billing system:

```bash
npm run migrate-billing
```

Or manually run:
```bash
npx tsx scripts/migrate-users-to-billing.ts
```

## 8. Environment Variables Checklist

Ensure all these variables are set in your `.env` file:

```env
# Stripe API Keys
✅ STRIPE_SECRET_KEY
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Webhook Secret
✅ STRIPE_WEBHOOK_SECRET

# Price IDs
✅ STRIPE_BASIC_MONTHLY_PRICE_ID
✅ STRIPE_BASIC_YEARLY_PRICE_ID
✅ STRIPE_PRO_MONTHLY_PRICE_ID
✅ STRIPE_PRO_YEARLY_PRICE_ID

# App URL
✅ NEXT_PUBLIC_APP_URL
```

## 9. Go Live Checklist

Before going to production:

1. ✅ Switch to Stripe **live mode**
2. ✅ Update all API keys to live keys (`sk_live_`, `pk_live_`)
3. ✅ Create products and prices in live mode
4. ✅ Configure production webhooks
5. ✅ Update Customer Portal settings
6. ✅ Test with real payment method
7. ✅ Set up proper error monitoring
8. ✅ Configure email notifications for failed payments

## 10. Monitoring & Maintenance

### Important Dashboards

- **Payments**: Monitor successful/failed payments
- **Subscriptions**: Track active subscriptions
- **Customers**: Manage customer data
- **Webhooks**: Monitor webhook delivery

### Common Issues

**Webhook not receiving events:**
- Check webhook URL is correct
- Verify webhook secret matches
- Check server logs for errors
- Use Stripe CLI to test locally

**Customer can't checkout:**
- Verify price IDs are correct
- Check Stripe is in correct mode (test/live)
- Ensure product is active

**Quota not resetting:**
- Check webhook for `invoice.paid` is working
- Verify `currentPeriodEnd` is set correctly

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)
- [Stripe CLI Reference](https://stripe.com/docs/cli)
