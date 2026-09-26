import Stripe from 'npm:stripe@17.5.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { submitGiftTransaction } from '../../shared/virtuous.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

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
        console.log('Subscription checkout completed:', session.id);
        
        // Send thank you email
        if (session.customer_email) {
          try {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: session.customer_email,
              subject: 'Thank You for Your Monthly Support!',
              body: `
                Dear Supporter,

                Thank you for becoming a monthly partner with Mercy House Adult Teen Challenge!

                Your recurring donation will directly impact lives and help residents on their journey to transformation.

                Subscription Details:
                - Amount: $${(session.amount_total / 100).toFixed(2)} per month
                - Subscription ID: ${session.subscription}

                You can manage your subscription at any time through your Stripe customer portal.

                With gratitude,
                Mercy House Team

                Questions? Contact us at info@mercyhouse.org
              `
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

        // Sync student-sponsorship subscription payments to Virtuous CRM+.
        const subscriptionId = invoice.subscription;
        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            if (subscription.metadata?.donation_type === 'student_sponsorship') {
              const apiKey = Deno.env.get('VIRTUOUS_API_KEY');
              if (!apiKey) {
                console.error('VIRTUOUS_API_KEY not configured — skipping Virtuous sync');
              } else {
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
                console.log('Sponsorship gift synced to Virtuous:', invoice.id);
              }
            }
          } catch (syncError) {
            console.error('Virtuous sync failed for invoice', invoice.id, ':', syncError);
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
    return Response.json({ 
      error: error.message 
    }, { status: 400 });
  }
});