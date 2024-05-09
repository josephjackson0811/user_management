"use server"

import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDataBase from '@/libs/db'
import User from '@/models/userSchema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {config} from '@/config'
 
connectToDataBase();

type ResponseData = {
  message: string,
  success: boolean,
  data: object
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const info = req.body

  switch(req.method) {
    case "POST" :
        if(info.id === "") {
            res.json({ message: 'Email Field is Required.', success: false, data: {} })
        }

        if(info.password === "") {
            res.json({ message: 'Password Field is Required.', success: false, data: {} })
        }

        User.findOne({id: info.id})
            .then((result) => {
                if(!result) {
                  res.json({ message: 'Email Does Not Exists.', success: false, data: {} })
                } else {
                  bcrypt.compare(info.password, result.password, (err, bool) => {
                    if(err) throw err;

                    if(!bool) {
                      res.json({ message: 'Incorrect Password.', success: false, data: {} })
                    } else {
                      const accessToken = jwt.sign({id: info.id, name: result.name, password: info.password}, config.accessKey, {expiresIn: 3600});
                      const refreshToken = jwt.sign({accessToken:  accessToken}, config.refreshKey, {expiresIn: 3600 * 10})
                      let data = {
                        data: result,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                      };
                      res.json({ message: 'Login Successfully!', success: true, data: data })
                    }
                  })
                }
            })
  }
}