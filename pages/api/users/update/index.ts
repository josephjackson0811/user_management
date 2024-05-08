"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDataBase from "@/libs/db";
import User from "@/models/userSchema";

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

  switch (req.method) {
    case "PUT":
      User.findOneAndUpdate({_id: info._id}, {id: info.id, name: info.name}, {$set: {new: true}})
        .then((user) => {
            if(user) res.json({ message: "Updated Users.", success: true, data: {} })
        })
        .catch((err) => {
            if(err) throw err;
        })
  }
}
