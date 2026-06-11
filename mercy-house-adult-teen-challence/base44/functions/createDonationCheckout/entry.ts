import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-12-18.acacia',
});

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { amount, email, campaignId } = await req.json();

        if (!amount || amount < 500) {
            return Response.json({ error: 'Minimum donation is $5' }, { status: 400 });
        }

        const appUrl = req.headers.get('origin') || 'https://your-app.base44.com';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'General Program Support',
                            description: 'One-time donation to Mercy House Adult & Teen Challenge',
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: email || undefined,
            success_url: `${appUrl}/?donation=success`,
            cancel_url: `${appUrl}/?donation=cancelled`,
            metadata: {
                base44_app_id: Deno.env.get("BASE44_APP_ID"),
                donation_type: 'general_program_support',
                campaign_id: campaignId || ''
            }
        });

        return Response.json({ url: session.url });
    } catch (error) {
        console.error('Donation checkout error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});