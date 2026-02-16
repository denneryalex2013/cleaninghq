import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.9.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return Response.json({ error: 'Method not allowed' }, { status: 405 });
        }

        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        if (!signature || !webhookSecret) {
            return Response.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
        }

        // Verify and construct the event using async method (required by Deno)
        let event;
        try {
            event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        } catch (error) {
            return Response.json({ error: `Webhook signature verification failed: ${error.message}` }, { status: 400 });
        }

        // Initialize Base44 client for database operations
        const base44 = createClientFromRequest(req);

        // Handle different event types
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const siteRequestId = session.metadata?.siteRequestId;

            if (!siteRequestId) {
                console.warn('Checkout session completed but no siteRequestId in metadata');
                return Response.json({ received: true });
            }

            // Update the SiteRequest with Stripe info and activate subscription
            await base44.asServiceRole.entities.SiteRequest.update(siteRequestId, {
                stripe_customer_id: session.customer,
                stripe_session_id: session.id,
                subscription_status: 'active',
                status: 'active'
            });

            console.log(`✅ Activated subscription for SiteRequest: ${siteRequestId}`);
        }

        if (event.type === 'customer.subscription.created') {
            const subscription = event.data.object;
            const customerId = subscription.customer;

            // Find SiteRequest by stripe_customer_id and update with subscription ID
            const siteRequests = await base44.asServiceRole.entities.SiteRequest.filter({
                stripe_customer_id: customerId
            });

            if (siteRequests.length > 0) {
                await base44.asServiceRole.entities.SiteRequest.update(siteRequests[0].id, {
                    stripe_subscription_id: subscription.id,
                    subscription_status: 'active'
                });
                console.log(`✅ Linked subscription ${subscription.id} to SiteRequest: ${siteRequests[0].id}`);
            }
        }

        if (event.type === 'customer.subscription.updated') {
            const subscription = event.data.object;
            const customerId = subscription.customer;

            const siteRequests = await base44.asServiceRole.entities.SiteRequest.filter({
                stripe_customer_id: customerId
            });

            if (siteRequests.length > 0) {
                const status = subscription.status === 'active' ? 'active' : 'cancelled';
                await base44.asServiceRole.entities.SiteRequest.update(siteRequests[0].id, {
                    subscription_status: status
                });
                console.log(`✅ Updated subscription status to ${status} for SiteRequest: ${siteRequests[0].id}`);
            }
        }

        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            const customerId = subscription.customer;

            const siteRequests = await base44.asServiceRole.entities.SiteRequest.filter({
                stripe_customer_id: customerId
            });

            if (siteRequests.length > 0) {
                await base44.asServiceRole.entities.SiteRequest.update(siteRequests[0].id, {
                    subscription_status: 'cancelled'
                });
                console.log(`✅ Cancelled subscription for SiteRequest: ${siteRequests[0].id}`);
            }
        }

        return Response.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});