import xlsx from 'node-xlsx'
import {IExcelData} from '../types'

export default (data: Buffer): IExcelData[] => {
	const obj = xlsx.parse(data)
	const rows: any = obj[0].data

	const results: IExcelData[] = []

	for (let i = 1; i < rows.length; ++i) {
		const row: string[] = rows[i]

		// row.forEach((item: string, i: number) => {
		// 	const objectKey: string = objectKeys[i];
		// 	result[objectKey] = item;
		// })

		const result: IExcelData = {
			email: row[0],
			fname: row[1],
			lname: row[2],
		}

		if (result.email) {
			results.push(result)
		}
	}

	return results
}
