import express, {Request, Response} from 'express'
import {Stripe} from "../../lib";

export default async (
    req: Request,
    res: Response
) => {
    try {
        console.log('are we inside')
        const endpointSecret = "whsec_1kdc8h4VlSis1oscgc2FyAZuZeAWwO2D";
        const sig = req.headers['stripe-signature'];
        let event;
        // @ts-ignore
        event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        switch (event.type) {
            case 'subscription_schedule.canceled':
                const subscriptionSchedule = event.data.object;
                // @ts-ignore
                const {customer,subscription}=subscriptionSchedule
                console.log(customer)
                console.log(subscription)
                // Then define and call a function to handle the event subscription_schedule.canceled
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        res.send();
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message)
            return res.status(500).json({
                message: 'Internal Server Error',
                error: err.message,
                requestTime: new Date().toISOString(),
            })
        }
    }
}
