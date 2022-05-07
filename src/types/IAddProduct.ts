export interface IAddProduct {
	readonly title: string
	readonly thumbnail: string
	readonly description: string
	readonly price: {
		readonly selling: {
			readonly min: number
			readonly max: number
		}
		readonly cost: {
			readonly min: number
			readonly max: number
		}
	}
	readonly marketingAngel: string[]
	readonly whereToSell: string[]
	readonly marketingVideo: string[]
	readonly supplierLinks: string[]
	readonly competitorLinks: string
	readonly isHot: boolean
	readonly category: string
	readonly advertisementText: string
	readonly targets: string
}
