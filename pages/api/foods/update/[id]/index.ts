'use server';

import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDataBase from '@/libs/db';
import Food from '@/models/foodSchema';

connectToDataBase();

type ResponseData = {
  message: string;
  success: boolean;
  data: object;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const info = req.body;

  switch (req.method) {
    case 'PUT':
      Food.findOneAndUpdate({ _id: req.query.id }, { food: info.food }, { $set: { new: true } }).then((food) => {
        res.json({ message: 'Food Updated.', success: true, data: info.food });
      });
  }
}
