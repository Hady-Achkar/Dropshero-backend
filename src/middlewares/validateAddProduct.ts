import {NextFunction, Response} from 'express'
import {CustomRequest, IAddProduct} from '../types'

export default async (
    req: CustomRequest<IAddProduct>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            targets,
            advertisementText,
            marketingVideo,
            marketingAngel,
            description,
            category,
            competitorLinks,
            supplierLinks,
            price,
            whereToSell,
            thumbnail,
            title,
            isHot,
        } = req.body
        if (!title || title === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing title',
                        field: 'title',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!thumbnail || thumbnail === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing thumbnail',
                        field: 'thumbnail',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!description || description === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing description',
                        field: 'description',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!price) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing price',
                        field: 'price',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!price.selling) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing price.selling',
                        field: 'price.selling',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!price.cost) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing price.cost',
                        field: 'price.cost',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!price.selling.min || price.selling.min === 0) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing price selling min',
                        field: 'price selling min',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (isNaN(price.selling.min)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'Price selling min is not a number',
                        field: 'price selling min',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!price.selling.max || price.selling.max === 0) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing price selling max',
                        field: 'price selling max',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (isNaN(price.selling.max)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'Price selling is not a number',
                        field: 'price selling max',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!price.cost.min || price.cost.min === 0) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing price cost min',
                        field: 'price cost min',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (isNaN(price.cost.min)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'Price cost min is not a number',
                        field: 'price cost min',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!price.cost.max || price.cost.max === 0) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing price cost max',
                        field: 'price cost max',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (isNaN(price.cost.max)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'Price cost is not a number',
                        field: 'price cost max',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!marketingVideo) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing marketingVideo',
                        field: 'marketingVideo',
                        type: 'string[]',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!Array.isArray(marketingVideo)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'marketingVideo is not an array',
                        field: 'marketingVideo',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        const validateMarketingVideo = marketingVideo.map((item) => {
            return item !== ''
        })
        if (validateMarketingVideo.includes(false)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'marketingVideo attributes are not recognized',
                        field: 'marketingVideo',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!marketingAngel) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing marketingAngel',
                        field: 'marketingAngel',
                        type: 'string[]',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!Array.isArray(marketingAngel)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'marketingAngel is not an array',
                        field: 'marketingAngel',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        const validateMarketingAngel = marketingAngel.map((item) => {
            return item !== ''
        })
        if (validateMarketingAngel.includes(false)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'marketingAngel attributes are not recognized',
                        field: 'marketingAngel',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!whereToSell) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing whereToSell',
                        field: 'whereToSell',
                        type: 'string[]',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!Array.isArray(whereToSell)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'whereToSell is not an array',
                        field: 'whereToSell',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        const validateElementsStrings = whereToSell.map((item) => {
            return item !== ''
        })
        if (validateElementsStrings.includes(false)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'whereToSell attributes are not recognized',
                        field: 'whereToSell',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }

        if (isHot === undefined) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing isHot',
                        field: 'isHot',
                        type: 'boolean',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!targets || targets === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing targets',
                        field: 'targets',
                        type: 'string',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!advertisementText || advertisementText === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing advertisementText',
                        field: 'advertisementText',
                        type: 'string',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }

        if (!competitorLinks || competitorLinks === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'Missing competitorLinks',
                        field: 'competitorLinks',
                        type: 'string',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!supplierLinks) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'missing supplierLinks',
                        field: 'supplierLinks',
                        type: 'string[]',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!Array.isArray(supplierLinks)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'supplierLinks is not an array',
                        field: 'supplierLinks',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        const vlidateSupplierLinks = supplierLinks.map((item) => {
            return item !== ''
        })
        if (vlidateSupplierLinks.includes(false)) {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'supplierLinks attributes are not recognized',
                        field: 'supplierLinks',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }
        if (!category || category === '') {
            return res.status(400).json({
                status: 'Failure',
                errors: [
                    {
                        name: 'category is not found',
                        field: 'category',
                    },
                ],
                requestTime: new Date().toISOString(),
            })
        }

        next()
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
