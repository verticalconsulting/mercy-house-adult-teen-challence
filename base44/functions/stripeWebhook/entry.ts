import Stripe from 'npm:stripe@17.5.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { submitGiftTransaction } from '../../shared/virtuous.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const SYNCABLE_SUBSCRIPTION_TYPES = new Set(['student_sponsorship', 'monthly_support']);

function giftAmount(value: number | null | undefined): number {
  return (value ?? 0) / 100;
}

function thankYouMessage(donationType: string, amount: number) {
  const amt = `$${amount.toFixed(2)}`;
  if (donationType === 'student_sponsorship') {
    return {
      subject: 'Thank You for Sponsoring a Student!',
      body: `Dear Supporter,

Thank you for sponsoring a student at Mercy House Adult Teen Challenge!

Your recurring gift of ${amt} per month provides housing, meals, biblical counseling, and vocational training for a resident on their journey to lasting transformation.

You can manage your sponsorship at any time through your Stripe customer portal.

With gratitude,
Mercy House Team

Questions? Contact us at info@mercyhouseatc.com`,
    };
  }
  if (donationType === 'monthly_support') {
    return {
      subject: 'Thank You for Your Monthly Support!',
      body: `Dear Supporter,

Thank you for becoming a monthly partner with Mercy House Adult Teen Challenge!

Your recurring gift of ${amt} per month directly impacts lives and helps residents on their journey to transformation.

You can manage your subscription at any time through your Stripe customer portal.

With gratitude,
Mercy House Team

Questions? Contact us at info@mercyhouseatc.com`,
    };
  }
  return {
    subject: 'Thank You for Your Gift!',
    body: `Dear Supporter,

Thank you for your generous gift of ${amt} to Mercy House Adult Teen Challenge!

Your donation goes directly to supporting residents through housing, meals, program care, and daily ministry operations.

With gratitude,
Mercy House Team

Questions? Contact us at info@mercyhouseatc.com`,
  };
}

// Sync a one-time (mode: payment) checkout session to Virtuous.
async function syncOneTimeGift(session: Stripe.Checkout.Session) {
  const apiKey = Deno.env.get('VIRTUOUS_API_KEY');
  if (!apiKey) {
    console.error('VIRTUOUS_API_KEY not configured — skipping Virtuous sync');
    return;
  }

  let customer: Stripe.Customer | null = null;
  if (session.customer) {
    try {
      customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer;
    } catch (e) {
      console.error('Failed to retrieve customer for one-time gift:', e);
    }
  }

  const transactionId =
    typeof session.payment_intent === 'string' ? session.payment_intent : session.id;

  await submitGiftTransaction({
    apiKey,
    transactionId,
    customer: {
      id: customer?.id || session.id,
      name: customer?.name || '',
      email: customer?.email || session.customer_email || '',
      phone: customer?.phone || '',
      address: customer?.address || undefined,
    },
    amount: giftAmount(session.amount_total),
    giftDate: new Date().toISOString(),
    currencyCode: (session.currency || 'usd').toUpperCase(),
    projectCode: '',
  });
  console.log('One-time gift synced to Virtuous:', session.id);
}

// Sync a subscription invoice (sponsorship or monthly support) to Virtuous.
async function syncSubscriptionGift(invoice: Stripe.Invoice) {
  const apiKey = Deno.env.get('VIRTUOUS_API_KEY');
  if (!apiKey) {
    console.error('VIRTUOUS_API_KEY not configured — skipping Virtuous sync');
    return;
  }

  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const donationType = subscription.metadata?.donation_type;
  if (!donationType || !SYNCABLE_SUBSCRIPTION_TYPES.has(donationType)) {
    return;
  }

  const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
  const projectCode = subscription.metadata?.virtuous_project_code || '';
  const paymentIntent = invoice.payment_intent;
  const transactionId = typeof paymentIntent === 'string' ? paymentIntent : invoice.id;
  const paidAt = invoice.status_transitions?.paid_at
    ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
    : new Date().toISOString();

  await submitGiftTransaction({
    apiKey,
    transactionId,
    customer: {
      id: customer.id,
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || undefined,
    },
    amount: invoice.total / 100,
    giftDate: paidAt,
    currencyCode: (invoice.currency || 'usd').toUpperCase(),
    projectCode,
  });
  console.log('Subscription gift synced to Virtuous:', invoice.id, donationType);
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log('Webhook event received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const donationType = session.metadata?.donation_type || '';

        // One-time gifts are captured here; subscription gifts sync via invoice.paid.
        if (session.mode === 'payment') {
          try {
            await syncOneTimeGift(session);
          } catch (e) {
            console.error('Virtuous one-time sync failed:', e);
          }
          try {
            await base44.analytics.track({ eventName: 'donation_completed' });
          } catch (e) {
            console.error('Failed to track donation_completed:', e);
          }
        }

        if (session.customer_email) {
          const { subject, body } = thankYouMessage(donationType, giftAmount(session.amount_total));
          try {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: session.customer_email,
              subject,
              body,
            });
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id, 'Status:', subscription.status);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription cancelled:', subscription.id);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        console.log('Invoice paid:', invoice.id);
        if (invoice.subscription) {
          try {
            await syncSubscriptionGift(invoice);
          } catch (syncError) {
            console.error('Virtuous sync failed for invoice', invoice.id, ':', syncError);
          }
          try {
            await base44.analytics.track({ eventName: 'donation_completed' });
          } catch (e) {
            console.error('Failed to track donation_completed:', e);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('Payment failed for invoice:', invoice.id);
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
});