import Stripe from 'npm:stripe@17.5.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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