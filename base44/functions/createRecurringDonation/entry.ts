import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';
import { getSafeAppUrl } from '../../shared/security.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-12-18.acacia',
});

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { amount, email, campaignId } = await req.json();

        if (!amount || amount < 500) {
            return Response.json({ error: 'Minimum monthly donation is $5' }, { status: 400 });
        }

        const appUrl = getSafeAppUrl(req);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Monthly Program Support',
                            description: 'Recurring monthly donation to Mercy House Adult & Teen Challenge',
                        },
                        unit_amount: amount,
                        recurring: {
                            interval: 'month'
                        }
                    },
                    quantity: 1,
                },
            ],
            customer_email: email || undefined,
            success_url: `${appUrl}/?subscription=success`,
            cancel_url: `${appUrl}/?subscription=cancelled`,
            metadata: {
                base44_app_id: Deno.env.get("BASE44_APP_ID"),
                donation_type: 'monthly_support',
                campaign_id: campaignId || ''
            }
        });

        return Response.json({ url: session.url });
    } catch (error) {
        console.error('Recurring donation checkout error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});