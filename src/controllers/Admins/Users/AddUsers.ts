import {Response} from 'express'
import * as bcrypt from 'bcryptjs'
import {
	parceExcelData,
	generatePassword,
	SendEmail
} from '../../../lib'
import { AccountStatus, BundleType, IExcelData, UserType } from '../../../types';
import {Users} from '../../../models';

export default async (req: any, res: Response) => {
	try {
		const parsedData: IExcelData[] = parceExcelData(req.files.excel.data);
		const sendEmailTasks: Promise<any>[] = [];

		parsedData.forEach((excelData: IExcelData) => {
			const password = generatePassword();
			sendEmailTasks.push(
				SendEmail(
					'',
					excelData.email ? excelData.email : '',
					'Dropshare registration',
					`You have been succesfully registered, here is your password ${password}`,
				),
			);
			excelData.password = password;
		})

		await Promise.all(sendEmailTasks);
		
		for (const excelData of parsedData) {
			const pass: string = excelData.password || '';
			const hashedPassword = await bcrypt.hash(pass, 10);

			excelData.password = hashedPassword;
			excelData.type = UserType.STANDARD;
			excelData.bundleType = BundleType.ONE_TIME;
			excelData.status = AccountStatus.VERIFIED;
		};

		const results = await Users.insertMany(parsedData);
		
		console.log(parsedData);
		console.log(results);
		
    res.json({
			success: true,
		});
	} catch (err) {
		if (err instanceof Error) {
			console.log(err.message)
			return res.status(500).json({
				message: 'Internal Server Error',
				error: err.message,
				requestTime: new Date().toISOString(),
			})
		}
	}
}