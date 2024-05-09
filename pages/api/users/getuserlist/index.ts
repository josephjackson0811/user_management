'use server';

import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDataBase from '@/libs/db';
import User from '@/models/userSchema';

connectToDataBase();

type ResponseData = {
  message: string;
  success: boolean;
  data: object;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  switch (req.method) {
    case 'GET':
      User.find().then((users) => {
        res.json({ message: 'Get Users.', success: true, data: users });
      });
  }
}
