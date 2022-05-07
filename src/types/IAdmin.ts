import {Document} from 'mongoose'
import {AdminRoles} from '.'

export interface IAdmin extends Document {
	fullName: string
	email: string
	password: string
	image: string
	role: AdminRoles.SUPPORT | AdminRoles.SUPER | AdminRoles.OWNER
}
