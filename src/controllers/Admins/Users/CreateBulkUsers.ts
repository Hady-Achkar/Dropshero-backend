import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import xlsx from 'xlsx';
import { AccountStatus, BundleType, IExcelData, UserType } from '../../../types';
import { Users } from '../../../models';
import { SendEmail, Stripe } from '../../../lib';

export default async (req: Request, res: Response) => {
  try {
    if (!req?.file) {
      return res.status(404).json({
        message: 'File was not sent',
      });
    }
    //@ts-ignore
    const file = req?.file?.excel; // assuming the file is uploaded with key `users`
    const workbook = xlsx.read(file, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users: IExcelData[] = xlsx.utils.sheet_to_json(sheet);
    const uniqueEmails = new Set<string>();
    const filteredUsers = users.filter((user: IExcelData) => {
      const email = user.email as string;
      if (uniqueEmails.has(email)) {
        return false;
      } else {
        uniqueEmails.add(email);
        return true;
      }
    });

    const userPromises = filteredUsers.map(async (user) => {
      //@ts-ignore
      const { email, fname, lname } = user;
      const password = 'A1B2c3F4'; // generate a random password
      const NEW_USER = await Users.create({
        email,
        password,
        fname,
        lname,
        type: UserType.STANDARD,
        bundleType: BundleType.ONE_TIME,
        status: AccountStatus.VERIFIED,
      });

      const payload = {
        email,
        fullName: NEW_USER.fullName,
        _id: NEW_USER._id,
        stripeId: NEW_USER.stripeId,
      };
      if (process.env.USERS_SECRET_KEY) {
        const token = await new Promise((resolve, reject) => {
          jwt.sign(
            payload,
            process.env.USERS_SECRET_KEY!,
            {
              expiresIn: '48h',
            },
            (err, token) => {
              if (err) {
                reject(err);
              } else {
                resolve(token);
              }
            }
          );
        });

        await SendEmail(
          `${NEW_USER.fullName}`,
          NEW_USER.email,
          'Welcome to easyecommerce.io',
          `<h1>You have been registered to easycommerce.io</h1>
            <p>Please use those login credentials</p>
            <p>Email address: ${NEW_USER.email}</p>
            <p>Password: A1B2c3F4</p>
          `
        )
        return {
          fullName: NEW_USER.fullName,
          email: NEW_USER.email,
          _id: NEW_USER._id,
          type: UserType.STANDARD,
          stripeId: NEW_USER.stripeId,
          activeSubscription: NEW_USER.activeSubscription,
          favorites: NEW_USER.favoriteProducts,
          bundleType: BundleType.ONE_TIME,
          accountStatus: AccountStatus.VERIFIED,
          requestTime: new Date().toISOString(),
          token,
        };
      } else {
        throw new Error('USERS_SECRET_KEY is not defined');
      }
    });

    const createdUsers = await Promise.all(userPromises);

    return res.status(200).json({
      message: "success",
      createdUsers
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
