import Stripe from 'npm:stripe@17.5.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const { residentId, amount, email } = await req.json();

    if (!residentId || !amount) {
      return Response.json({ error: 'Resident ID and amount are required' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const resident = await base44.asServiceRole.entities.Resident.get(residentId);

    if (!resident) {
      return Response.json({ error: 'Resident not found' }, { status: 404 });
    }

    // Create a custom price for this sponsorship
    const price = await stripe.prices.create({
      unit_amount: amount * 100,
      currency: 'usd',
      recurring: { interval: 'month' },
      product_data: {
        name: `Sponsor ${resident.full_name}`,
        description: `Monthly sponsorship for ${resident.full_name}`
      }
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/SponsorStudent?sponsorship=success&resident=${resident.full_name}`,
      cancel_url: `${req.headers.get('origin')}/SponsorStudent?sponsorship=cancelled`,
      customer_email: email || undefined,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        resident_id: residentId,
        resident_name: resident.full_name
      }
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Sponsorship checkout error:', error);
    return Response.json({ 
      error: error.message || 'Failed to create checkout session' 
    }, { status: 500 });
  }
});