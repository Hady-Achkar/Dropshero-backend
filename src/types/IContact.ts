import {Document} from 'mongoose'

export interface IContact extends Document {
    email: string
    fullName: string
    message: string
}
