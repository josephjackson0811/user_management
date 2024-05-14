'use server';

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

type ResponseData = {
  message: string;
  success: boolean;
  data: object;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  switch (req.method) {
    case 'GET':
      const refresh: string = req.headers['refresh'] as string;

      const decode: JwtPayload = jwt.decode(refresh) as JwtPayload;

      const accessToken = jwt.sign(
        { id: decode.id, name: decode.name, password: decode.password },
        `${process.env.ACCESS_KEY}`,
        { expiresIn: '5s' },
      );

      res.json({ message: 'Access Token.', success: true, data: { accessToken: accessToken } });
  }
}
