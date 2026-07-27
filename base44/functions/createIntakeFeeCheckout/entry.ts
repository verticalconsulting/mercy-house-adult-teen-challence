import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Stripe from 'npm:stripe@17.5.0';
import { getSafeAppUrl } from '../../shared/security.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-12-18.acacia',
});

Deno.serve(async (req) => {
    try {
        const { paymentType, email, applicantName, donorPaysForNext } = await req.json();
        // paymentType: 'full' ($1000 one-time) | 'installment' ($100/month x 10) | 'donor_pays' (donor covers next person's fee)

        const appUrl = getSafeAppUrl(req);

        let session;

        if (paymentType === 'installment') {
            // 10 monthly payments of $100
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'subscription',
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Mercy House Intake Fee — Monthly Plan',
                            description: '10 monthly installments of $100 toward the $1,000 intake fee',
                        },
                        unit_amount: 10000, // $100
                        recurring: { interval: 'month', interval_count: 1 }
                    },
                    quantity: 1,
                }],
                customer_email: email || undefined,
                success_url: `${appUrl}/IntakeForm?intake_payment=success`,
                cancel_url: `${appUrl}/IntakeForm?intake_payment=cancelled`,
                metadata: {
                    base44_app_id: Deno.env.get('BASE44_APP_ID'),
                    payment_type: 'intake_fee_installment',
                    applicant_name: applicantName || ''
                }
            });
        } else if (paymentType === 'donor_pays') {
            // Donor covering intake fee for next incoming resident
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Sponsor a New Resident\'s Intake Fee',
                            description: 'Cover the $1,000 intake fee for the next person entering Mercy House — giving someone a fresh start.',
                        },
                        unit_amount: 100000, // $1,000
                    },
                    quantity: 1,
                }],
                customer_email: email || undefined,
                success_url: `${appUrl}/Donate?intake_sponsored=success`,
                cancel_url: `${appUrl}/Donate?intake_sponsored=cancelled`,
                metadata: {
                    base44_app_id: Deno.env.get('BASE44_APP_ID'),
                    payment_type: 'donor_intake_fee',
                    donor_pays_for_next: 'true'
                }
            });
        } else {
            // Full one-time payment of $1,000
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Mercy House Intake Fee — Full Payment',
                            description: 'One-time $1,000 intake fee for Mercy House Adult & Teen Challenge program',
                        },
                        unit_amount: 100000, // $1,000
                    },
                    quantity: 1,
                }],
                customer_email: email || undefined,
                success_url: `${appUrl}/IntakeForm?intake_payment=success`,
                cancel_url: `${appUrl}/IntakeForm?intake_payment=cancelled`,
                metadata: {
                    base44_app_id: Deno.env.get('BASE44_APP_ID'),
                    payment_type: 'intake_fee_full',
                    applicant_name: applicantName || ''
                }
            });
        }

        return Response.json({ url: session.url });
    } catch (error) {
        console.error('Intake fee checkout error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});