import {Response, Request} from 'express'
import * as jwt from 'jsonwebtoken'
import xlsx from 'xlsx'
import {AccountStatus, BundleType, IExcelData, UserType} from '../../../types'
import {Users} from '../../../models'
import {SendEmail, Stripe} from '../../../lib'

export default async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const file = req?.files?.file.data // assuming the file is uploaded with key `excel`

		const workbook = xlsx.read(file, {type: 'buffer'})
		const sheet = workbook.Sheets[workbook.SheetNames[0]]

		const users: IExcelData[] = xlsx.utils.sheet_to_json(sheet)

		const uniqueEmails = new Set<string>()
		const filteredUsers = users.filter((user: IExcelData) => {
			const email = user.email as string
			if (uniqueEmails.has(email)) {
				return false
			} else {
				uniqueEmails.add(email)
				return true
			}
		})

		const userPromises = filteredUsers.map(async (user) => {
			//@ts-ignore
			const {email, fname, lname} = user
			const password = 'A1B2c3F4' // generate a random password

			const isEmailExists = await Users.findOne({email: email})
      

			if (isEmailExists===null) {
      console.log('isEmailExists', isEmailExists);

				const NEW_USER = await Users.create({
					email,
					password,
					fname,
					lname,
					type: UserType.STANDARD,
					bundleType: BundleType.ONE_TIME,
					status: AccountStatus.VERIFIED,
				})
			}
		})

		const createdUsers = await Promise.all(userPromises)

		return res.status(200).json({
			message: 'success',
			createdUsers,
		})
	} catch (error) {
		console.error(error)

		res.status(500).json({
			message: 'Internal server error',
		})
	}
}
