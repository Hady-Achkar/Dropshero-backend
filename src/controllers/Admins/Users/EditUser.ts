import {Request, Response} from 'express'
import {Users} from '../../../models'
import * as bcrypt from 'bcryptjs'
import {isValidObjectId} from 'mongoose'

export default async (req: Request, res: Response) => {
	try {
		const {userId} = req.query

		if (!userId || userId === '') {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong ObjectId format',
						field: 'userId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (!isValidObjectId(userId)) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong userId format',
						field: 'userId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		const _verifyUser = await Users.findById(userId)

		if (!_verifyUser) {
			return res.status(404).json({
				status: 'Failure',
				errors: [
					{
						name: 'userId was not found',
						field: 'userId',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		const {fname, lname, password} = req.body
		const newFname = fname
			.split(' ')
			.map((val: string) => val.charAt(0).toUpperCase() + val.slice(1))
			.join(' ')
		const newLname = lname
			.split(' ')
			.map((val: string) => val.charAt(0).toUpperCase() + val.slice(1))
			.join(' ')
		const newfullName = `${newFname} ${newLname}`

		let _updated
		if (password) {
			const hashedPassword = await bcrypt.hash(password, 10)
			_updated = await Users.findByIdAndUpdate(userId, {
				$set: {
					fname,
					lname,
					password: hashedPassword,
					fullName: newfullName,
				},
			})
		} else {
			_updated = await Users.findByIdAndUpdate(userId, {
				$set: {
					fname,
					lname,
					fullName: newfullName,
				},
			})
		}
		return res.status(200).json({
			status: 'Success',
			message: 'User was updated successfully',
			requestTime: new Date().toISOString(),
		})
	} catch (err) {
		if (err instanceof Error) {
			return res.status(500).json({
				message: 'Internal Server Error',
				error: err.message,
				requestTime: new Date().toISOString(),
			})
		}
	}
}
