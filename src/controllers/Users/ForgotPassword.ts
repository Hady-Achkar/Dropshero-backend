import {Request, Response} from 'express'
import {Users} from '../../models'
import {UserType} from '../../types'
import {v4} from 'uuid'
import {createClient} from 'redis'
import {SendEmail} from '../../lib'

export default async (req: Request, res: Response) => {
	try {
		const RedisClient = createClient()
		await RedisClient.connect()
		RedisClient.on('error', (err) => console.log('Redis Client Error', err))
		RedisClient.on('connect', (err) => console.log('Redis Client Error', err))
		const {email: USER_EMAIL} = req.body
		if (!USER_EMAIL || USER_EMAIL === '') {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, email does not exist',
				requestTime: new Date().toISOString(),
			})
		}
		const FORMATTED_EMAIL = USER_EMAIL.toString().toLowerCase()
		const _verifyUser = await Users.findOne({
			email: FORMATTED_EMAIL,
			type: UserType.STANDARD,
		})
		if (!_verifyUser) {
			return res.status(404).json({
				status: 'Failure',
				message: 'User account was not found',
				requestTime: new Date().toISOString(),
			})
		}

		const resetToken = v4()
		const key = process.env.FORGET_PASSWORD_PREFIX + resetToken

		await SendEmail(
			`${_verifyUser?.fname} ${_verifyUser?.lname}`,
			_verifyUser?.email,
			'Reset Password',
			`<a href='https://dropshero.com/confirm-password/${resetToken}'>Reset password </a>
        	<h2>This operation will expire in 1 hour</h2>'`
		)
		const payload = {
			userId: _verifyUser,
		}
		await RedisClient.setEx(key, 3600, JSON.stringify(payload))
		return res.status(204).json({
			status: 'Success',
			message: 'Email sent successfully',
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
