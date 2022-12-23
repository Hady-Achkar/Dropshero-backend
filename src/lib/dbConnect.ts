import mongoose from 'mongoose'

export default () => {
	const mongoURI = `${process.env.MONGO_URI}` || ''
	mongoose
		.connect(mongoURI, {
			useUnifiedTopology: true,
			useFindAndModify: true,
			writeConcern: {
				w: 'majority',
				j: true,
				wtimeout: 500,
			},
			useNewUrlParser: true,
			useCreateIndex: true,
		})
		.then((res) => {
			console.log(`[i] Connected to database: ${mongoURI}`)
		})
		.catch((err) => {
			console.error(`Error: ${err.message}`)
			process.exit(1)
		})
}
