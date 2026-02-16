import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const { businessId, email } = await req.json();

        if (!businessId || !email) {
            return Response.json({ error: 'businessId and email are required' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: 'price_1T1EGzK8mU2g6s92CcF6yY2V',
                    quantity: 1,
                },
            ],
            customer_email: email,
            success_url: `${req.headers.get('origin') || 'https://preview.cleaninghq.io'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin') || 'https://preview.cleaninghq.io'}/cancel`,
            metadata: {
                businessId: businessId,
            },
        });

        return Response.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});