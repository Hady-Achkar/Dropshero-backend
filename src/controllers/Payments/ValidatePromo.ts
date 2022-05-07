import {Request, Response} from 'express'
import {Stripe} from '../../lib'

export default async (
    req: Request,
    res: Response
) => {
    try {
        //@ts-ignore
        const {stripeId} = req.user
        const {promoCode} = req.query
        const invoices = await Stripe.invoices.list({customer: stripeId})

        if (!promoCode || promoCode === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing promoCode',
                        field: 'promoCode',
                        type: 'string'
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        const _verifyPromo = await Stripe.promotionCodes.list({code: promoCode as string, active: true})
        if (_verifyPromo.data.length === 0) {
            return res.status(200).json({
                status: 'Success',
                message: 'Promo was not found',
                coupon: null,
                requestTime: new Date().toISOString(),
            })
        }
        const amount = invoices.data.length > 0 ?
            invoices.data[invoices.data.length - 1]?.amount_paid
            :
            0
        return res.status(200).json({
            status: 'Success',
            message: 'Promo was verified successfully',
            coupon: _verifyPromo.data[0].coupon,
            latestInvoiceAmount: amount,
            requestTime: new Date().toISOString(),
        })
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: 'Internal Server Error',
                error: err.message,
                requestTime: new Date().toISOString(),
            })
        }
    }
}
