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
	readonly isHot: boolean
	readonly category: string
}
