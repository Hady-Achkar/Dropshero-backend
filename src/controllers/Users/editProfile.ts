import {Request, Response} from 'express'
import {Users} from "../../models";
import * as bcrypt from 'bcryptjs'

export default async (
    req: Request,
    res: Response
) => {
    try {
        //@ts-ignore
        const {_id: UserId} = req.user
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
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            await Users.findByIdAndUpdate(UserId, {
                $set: {
                    fname,
                    lname,
                    password: hashedPassword,
                    fullName: newfullName
                }
            })
        } else {
            await Users.findByIdAndUpdate(UserId, {
                $set: {
                    fname,
                    lname,
                    fullName: newfullName
                }
            })
        }
        return res.status(204).json({
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
