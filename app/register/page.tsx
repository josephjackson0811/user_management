"use client";

import { ArrowBack, BackHand } from "@mui/icons-material";
import { Backdrop, Box, Container, TextField } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const userRegister = () => {
    if (password !== passwordConfirm) {
      alert("Password Incoreect");
    } else {
      const userData = {
        id: id.toString(),
        name: name.toString(),
        password: password.toString(),
      };

      axios
        .post("/api/users/register", userData)
        .then((data) => {
          if (!data.data.success) {
            alert(data.data.message);
          } else {
            const info = data.data.data;

            alert(info.name);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Box className="relative">
      <Link
        href="/"
        className="absolute top-10 left-10 flex items-center text-lg hover:text-blue-600 p-2"
      >
        <ArrowBack /> back
      </Link>
      <Container className="flex flex-col justify-around items-center pt-24">
        <p className=" text-8xl mb-32">Register</p>
        <TextField
          fullWidth
          label="User Name"
          onChange={(e) => setName(e.target.value)}
          className="mb-16"
        />
        <TextField
          fullWidth
          label="User ID"
          onChange={(e) => setId(e.target.value)}
          className="mb-16"
        />
        <TextField
          fullWidth
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="mb-16"
        />
        <TextField
          fullWidth
          label="Password Confirm"
          onChange={(e) => setPasswordConfirm(e.target.value)}
          type="password"
          className="mb-16"
        />
        <button
          className="border-blue-500 px-5 py-3 bg-blue-500 rounded-md hover:bg-blue-700 transition-all text-bold text-white text-xl mb-5"
          onClick={() => userRegister()}
        >
          Submit
        </button>
        <p>
          Do you have your account already? If so,&nbsp;
          <Link
            href="/login"
            className="underline hover:text-gray-300 transition-all"
          >
            Click Here
          </Link>{" "}
          to register now
        </p>
      </Container>
    </Box>
  );
};

export default Register;
