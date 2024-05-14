'use server';

import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDataBase from '@/libs/db';
import User from '@/models/userSchema';
import bcrypt from 'bcrypt';
import { isValidEmail } from '@/libs/email-validation';

connectToDataBase();

const saltRound = 10;

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

      if (!isValidEmail(info.id)) {
        res.json({ message: 'Invalid Email.', success: false, data: {} });
      }

      if (info.name === '') {
        res.json({ message: 'User Name Field is Required.', success: false, data: {} });
      }

      if (info.password === '') {
        res.json({ message: 'Password Field is Required.', success: false, data: {} });
      }

      if (info.password.length < 6 || info.password.length > 30) {
        res.json({ message: 'Password Must Contain Between 6 ~ 30 Characters.', success: false, data: {} });
      }

      User.findOne({ id: info.id }).then((result) => {
        if (result) {
          res.json({ message: 'Email Already Exists.', success: false, data: {} });
        } else {
          bcrypt.hash(info.password, saltRound, (err, password) => {
            if (err) throw err;

            const data = new User({
              id: info.id,
              name: info.name,
              password: password,
            });

            data.save().then(() => {
              res.json({ message: 'Register Successfully.', success: true, data: {} });
            });
          });
        }
      });
  }
}
