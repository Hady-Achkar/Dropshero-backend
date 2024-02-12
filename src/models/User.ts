import {model, Schema} from 'mongoose'
import {AccountStatus, IUser} from '../types'
import {Stripe} from '../lib'
import * as bcrypt from 'bcryptjs'

const UserSchema = new Schema<IUser>(
	{
		fullName: {
			type: String,
			trim: true,
		},
		fname: {
			type: String,
			trim: true,
			required: [true, 'fname is a required field'],
		},
		lname: {
			type: String,
			trim: true,
		},
		password: {
			type: String,
			trim: true,
			required: [true, 'password is a required field'],
		},
		email: {
			type: String,
			lowercase: true,
			trim: true,
			unique: true,
		},
		type: {
			type: String,
			trim: true,
		},
		activeSubscription: {
			type: String,
			trim: true,
		},
		stripeId: {
			type: String,
			trim: true,
		},
		activePrice: {
			type: String,
			trim: true,
		},
		favoriteProducts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Products',
			},
		],
		status: {
			type: String,
			default: AccountStatus.NOT_VERIFIED,
		},
		bundleType: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
		minimize: false,
		versionKey: false,
	}
)
UserSchema.index({
	fullName: 'text',
	email: 'text',
	type: 'text',
	stripeId: 'text',
})
UserSchema.pre('save', async function (next) {
	const fname = this.fname
		.split(' ')
		.map((val: string) => val.charAt(0).toUpperCase() + val.slice(1))
		.join(' ')
	this.fname = fname
	const lname = this.lname
	this.lname = lname
	this.fullName = `${fname} ${lname}`
	this.email = this.email.toLowerCase()
	// if (this.password.length < 18) {
	//     this.password = await bcrypt.hash(this.password, 10)
	// }
	if (this.isNew) {
		this.password = await bcrypt.hash(this.password, 10)
		const stripeCustomer = await Stripe.customers.create({
			email: this.email,
			name: `${fname} ${lname}`,
		})
		this.stripeId = stripeCustomer.id
	}
	this.activeSubscription = ''
	next()
})
export default model<IUser>('User', UserSchema)
