import {model, Schema} from 'mongoose'
import {IAdmin, AdminRoles} from '../types'
import * as bcrypt from 'bcryptjs'

const AdminSchema = new Schema<IAdmin>(
	{
		fullName: {
			type: String,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			trim: true,
			required: [true, 'password is a required field'],
		},
		email: {
			type: String,
			trim: true,
			unique: true,
		},
		role: {
			type: String,
			trim: true,
			default: AdminRoles.SUPPORT,
		},
		image: {
			type: String,
			trim: true,
			default: 'https://source.unsplash.com/random',
		},
	},
	{
		timestamps: true,
		minimize: false,
		versionKey: false,
	}
)
AdminSchema.index({
	fullName: 'text',
	email: 'text',
})
AdminSchema.pre('save', async function (next) {
	this.email = this.email.toLowerCase()
	next()
})
AdminSchema.methods.hashPassword = async function (next) {
	this.password = await bcrypt.hash(this.password, 10)
	next()
}
export default model<IAdmin>('Admin', AdminSchema)
