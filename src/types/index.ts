import {Request} from 'express'

export type {IUser} from './IUser'
export {UserType} from './IUser'
export type {IProduct, IProductPrice, IUnitPriceSchema} from './IProduct'
export type {ISignup} from './ISignup'
export type {ISignin} from './ISignin'
export type {IAddPaymentMethod} from './IAddPaymentMethod'
export type {IContact} from './IContact'
export {AccountStatus, BundleType, AdminRoles} from './enums'
export type {IAdmin} from './IAdmin'
export type {IAddProduct} from './IAddProduct'
export * from './IInfulencer'
export * from './IStore'
export * from './IExcelData'
export type {IAmazonProduct} from './IAmazonProduct'
export interface CustomRequest<T> extends Request {
	readonly body: T
}
