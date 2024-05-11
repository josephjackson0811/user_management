'use server';

import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDataBase from '@/libs/db';
import User from '@/models/userSchema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { isValidEmail } from '@/libs/email-validation';

connectToDataBase();

type ResponseData = {
  message: string;
  success: boolean;
  data: object;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const info = req.body;

  switch (req.method) {
    case 'POST':
      if (info.id === '') {
        res.json({ message: 'Email Field is Required.', success: false, data: {} });
      }

      if(!isValidEmail(info.id)) {
        res.json({ message: 'Invalid Email.', success: false, data: {} });
      }

      if (info.password === '') {
        res.json({ message: 'Password Field is Required.', success: false, data: {} });
      }

      if (info.password.length < 6 || info.password.length > 30) {
        res.json({ message: 'Password Must Contain Between 6 ~ 30 Characters.', success: false, data: {} });
      }

      User.findOne({ id: info.id }).then((result) => {
        if (!result) {
          res.json({ message: 'Email Does Not Exist.', success: false, data: {} });
        } else {
          bcrypt.compare(info.password, result.password, (err, bool) => {
            if (err) throw err;

            if (!bool) {
              res.json({ message: 'Incorrect Password.', success: false, data: {} });
            } else {
              const accessToken = jwt.sign(
                { id: info.id, name: result.name, password: info.password },
                `${process.env.ACCESS_KEY}`,
                { expiresIn: '60s' },
              );
              const refreshToken = jwt.sign(
                { id: info.id, name: result.name, password: info.password },
                `${process.env.REFRESH_KEY}`,
                { expiresIn: '1d' },
              );
              let data = {
                data: result,
                accessToken: accessToken,
                refreshToken: refreshToken,
              };
              res.json({ message: 'Login Successfully!', success: true, data: data });
            }
          });
        }
      });
  }
}
