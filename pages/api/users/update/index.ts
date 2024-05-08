"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDataBase from "@/libs/db";
import User from "@/models/userSchema";
import jwt from 'jsonwebtoken';
import { config } from "@/config";

connectToDataBase();

type ResponseData = {
  message: string;
  success: boolean;
  data: object;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const info = req.body;
    const decodedAccess: any = jwt.decode(info.access);
    console.log(decodedAccess)
  switch (req.method) {
    case "PUT":
        User.findOne({id: info.id}).then(user => {
            if(user && user.id !== decodedAccess.id) {
                res.json({ message: "User Already Exists.", success: false, data: {} })
            } else {
                User.findOneAndUpdate({_id: info._id}, {id: info.id, name: info.name}, {$set: {new: true}})
                .then((user) => {
                    const accessToken = jwt.sign({id: info.id, name: info.name, password: decodedAccess.password}, config.accessKey, {expiresIn: 3600});
                    const refreshToken = jwt.sign({accessToken:  accessToken}, config.refreshKey, {expiresIn: 3600 * 10})
                    let data = {
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    };

                    if(user) res.json({ message: "Updated Users.", success: true, data: data })
                })
                .catch((err) => {
                    if(err) throw err;
                })
            }
        })

  }
}
