'use server';

import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDataBase from '@/libs/db';
import User from '@/models/userSchema';
import Food from '@/models/foodSchema';

connectToDataBase();

type ResponseData = {
  message: string;
  success: boolean;
  data: object;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  switch (req.method) {
    case 'GET':
      Food.find({})
        .populate('creator')
        .then((foods) => {
          res.json({ message: 'Get Foods.', success: true, data: foods });
        });
  }
}
