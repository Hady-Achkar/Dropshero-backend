import {Request, Response} from 'express'
import {Users} from "../../models";
import * as bcrypt from 'bcryptjs'
import {createClient} from "redis";

export default async (
    req: Request,
    res: Response
) => {
    try {
        const RedisClient = createClient();
        await RedisClient.connect();
        RedisClient.on('error', (err) => console.log('Redis Client Error', err));
        RedisClient.on('connect', (err) => console.log('Redis Client Error', err));
        const {token: RESET_TOKEN, password: NEW_PASSWORD} = req.body;
        if (!RESET_TOKEN || RESET_TOKEN === '') {
            return res.status(400).json({
                status: 'Failure',
                message: 'Bad request, reset token was not found ',
                requestTime: new Date().toISOString(),
            });
        }
        if (!NEW_PASSWORD || NEW_PASSWORD === '') {
            return res.status(400).json({
                status: 'Failure',
                message: 'Bad request, new password was not found',
                requestTime: new Date().toISOString(),
            });
        }
        const key = process.env.FORGET_PASSWORD_PREFIX + RESET_TOKEN;
        RedisClient.get(key).then(async (payload) => {
            if (payload) {
                const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
                const parsedPayload = JSON.parse(payload);
                await Users.findByIdAndUpdate(
                    parsedPayload.userId,
                    {
                        $set: {
                            password: hashedPassword,
                        },
                    }
                );
                await RedisClient.del(key)
                return res.status(200).json({
                    status: 'Success',
                    message: 'Password was reset successfully',
                    requestTime: new Date().toISOString(),
                });
            } else {
                return res.status(404).json({
                    status: 'Failure',
                    message: 'Operation has expired',
                    requestTime: new Date().toISOString(),
                });
            }
            //@ts-ignore
        }).catch((err) => {
            console.log(err)
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
