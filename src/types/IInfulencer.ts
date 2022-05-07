import {Document} from 'mongoose'

export interface IInfulencer extends Document {
	channelName: string
	platform: string
	category: string
	followers: number
	country: string
	age: number
	description: string
	image: string
}
