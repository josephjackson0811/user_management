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
  const info = req.body;

  switch (req.method) {
    case 'POST':
      Food.findOne({ food: info.food }).then((food) => {
        if (food) {
          res.json({ message: 'Food Already Exists.', success: false, data: {} });
        } else {
          User.findOne({ id: info.creator }).then((user) => {
            const data = new Food({
              food: info.food,
              creator: user._id,
            });

            data.save().then(() => {
              Food.find({})
                .populate('creator')
                .then((user) => {
                  res.json({ message: 'Food Saved.', success: true, data: user });
                });
            });
          });
        }
      });
  }
}
