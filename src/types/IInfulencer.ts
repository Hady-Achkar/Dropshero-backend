import {Document} from 'mongoose'

export interface IInfulencer extends Document {
	channelName: string
	platform: string
	category: string
	followers: string
	country: string
	description: string
	youtube: string
	instagram: string
	tiktok: string
	snapchat: string
	image: string
	language: string
}
