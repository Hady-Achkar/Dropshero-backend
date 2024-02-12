import {stringList} from 'aws-sdk/clients/datapipeline'
import {Document} from 'mongoose'

export interface IStore extends Document {
	name: string
	category: string
	link: string
	description: string
	type: string
}
