import Stripe from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config()
const stripeKey = process.env.STRIPE_SECRET_KEY
if (!stripeKey) {
	console.log('[e]-Stripe secret key was not found... Server is exiting')
	process.exit(1)
}
const stripe = new Stripe(stripeKey, {
	apiVersion: '2020-08-27',
})

export default stripe
