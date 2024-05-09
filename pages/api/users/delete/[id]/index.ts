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
    case 'DELETE':
      const id = req.query.id;

      User.deleteOne({ _id: id }).then(() =>
        res.json({ message: 'Delete User Successfully.', success: true, data: {} }),
      );
  }
}
