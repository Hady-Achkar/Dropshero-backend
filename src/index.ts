import express from 'express'
import * as dotenv from 'dotenv'
import {
	AuthRouter,
	UsersRouter,
	ProductsRouter,
	PaymentsRouter,
	BundlesRouter,
	UtilsRouter,
	AdminRouter,
	InfluencersRouter,
	StoresRouter,
} from './routes'
import bodyParser from 'body-parser'
import cors from 'cors'
import multer from 'multer'
import fileUpload from 'express-fileupload'
import {dbConnect} from './lib'
import morgan from 'morgan'
import {AttachRealIp} from './middlewares'

const main = async () => {
	dotenv.config()

	dbConnect()
	const app = express()
	app.use(cors())
	app.use(
		express.json({
			limit: '50mb',
		})
	)
	app.use(morgan('dev'))
	app.use(
		fileUpload({
			limits: {},
		})
	)
	app.use(multer().single(''))

	app.use(bodyParser.json())
	app.use(AttachRealIp)
	app.use('/auth', AuthRouter)
	app.use('/products', ProductsRouter)
	app.use('/users', UsersRouter)
	app.use('/payments', PaymentsRouter)
	app.use('/bundles', BundlesRouter)
	app.use('/utils', UtilsRouter)
	app.use('/admin', AdminRouter)
	app.use('/influencers', InfluencersRouter)
	app.use('/stores', StoresRouter)
	app.listen(process.env.MAIN_PORT, () => {
		console.log(`[i] Server is listening on port ${process.env.MAIN_PORT}`)
	})
}
main()
