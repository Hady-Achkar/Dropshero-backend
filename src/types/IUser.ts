import {Document} from 'mongoose'
import {IProduct} from './IProduct'
import {AccountStatus, BundleType} from './enums'

export enum UserType {
    GOOGLE = 'GOOGLE',
    FACEBOOK = 'FACEBOOK',
    STANDARD = 'STANDARD',
}

export interface IUser extends Document {
    fullName?: string
    fname: string
    lname: string
    password: string
    email: string
    type: UserType
    activeSubscription: string
    stripeId: string
    activePrice: string
    favoriteProducts: IProduct[]
    status: AccountStatus
    bundleType: BundleType
    referral?: string
    username: string
}
