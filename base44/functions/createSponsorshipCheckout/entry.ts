import Stripe from 'npm:stripe@17.5.0';
import { getSafeAppUrl } from '../../shared/security.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const SPONSORSHIP_PRODUCT_NAME = 'Mercy House Student Sponsorship';
const SPONSORSHIP_AMOUNT_CENTS = 4000; // $40.00 / month

/*
 * Returns the recurring Stripe Price for the student sponsorship plan,
 * creating the Product + Price once and reusing them on every checkout.
 * This is the durable "plan" — a single Price object in Stripe shared by
 * all sponsorships, rather than an inline price created per checkout.
 */
async function getOrCreateSponsorshipPrice() {
  let product: Stripe.Product | undefined;

  const found = await stripe.products.search({
    query: `name:'${SPONSORSHIP_PRODUCT_NAME}'`,
    limit: 1,
  });
  product = found.data[0];

  if (!product) {
    product = await stripe.products.create({
      name: SPONSORSHIP_PRODUCT_NAME,
      description: 'Monthly student sponsorship — Mercy House Adult & Teen Challenge',
    });
  }

  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    type: 'recurring',
    limit: 100,
  });
  const existing = prices.data.find(
    (p) => p.recurring?.interval === 'month' && p.unit_amount === SPONSORSHIP_AMOUNT_CENTS
  );
  if (existing) return existing;

  return stripe.prices.create({
    unit_amount: SPONSORSHIP_AMOUNT_CENTS,
    currency: 'usd',
    recurring: { interval: 'month' },
    product: product.id,
    nickname: 'Student Sponsorship — $40/month',
  });
}

Deno.serve(async (req) => {
  try {
    const { email, residentId, residentName } = await req.json();
    const appUrl = getSafeAppUrl(req);
    const projectCode = Deno.env.get('VIRTUOUS_SPONSORSHIP_PROJECT_CODE') || '';

    const price = await getOrCreateSponsorshipPrice();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: price.id, quantity: 1 }],
      customer_email: email || undefined,
      success_url: `${appUrl}/SponsorStudent?sponsorship=success`,
      cancel_url: `${appUrl}/SponsorStudent?sponsorship=cancelled`,
      subscription_data: {
        metadata: {
          base44_app_id: Deno.env.get('BASE44_APP_ID'),
          donation_type: 'student_sponsorship',
          virtuous_project_code: projectCode,
          resident_id: residentId || '',
          resident_name: residentName || '',
        },
      },
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        donation_type: 'student_sponsorship',
        virtuous_project_code: projectCode,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Sponsorship checkout error:', error);
    return Response.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
});