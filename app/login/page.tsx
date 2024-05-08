"use client";

import { ArrowBack } from "@mui/icons-material";
import { Box, Container, TextField } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";

const Login = () => {
  //State
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const userLogin = () => {
    const userData = {
      id: id.toString(),
      password: password.toString(),
    };

    axios
      .post("/api/users/login", userData)
      .then((data) => {
        if (!data.data.success) {
          alert(data.data.message);
        } else {
          const userInfo = data.data.data;

          window.localStorage.setItem("accessToken", userInfo.accessToken);
          window.localStorage.setItem("refreshToken", userInfo.refreshToken);

          window.location.href = "/userlist";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box className="relative">
      <Link
        href="/"
        className="absolute top-10 left-10 flex items-center text-lg hover:text-blue-700 p-2"
      >
        <ArrowBack /> back
      </Link>
      <Container className="flex flex-col justify-around items-center pt-24">
        <p className=" text-8xl mb-40">Login</p>
        <TextField
          fullWidth
          label="User ID"
          onChange={(e) => setId(e.target.value)}
          className="mb-20"
        />
        <TextField
          fullWidth
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="mb-20"
        />
        <button
          className="border-blue-500 px-5 py-3 bg-blue-500 rounded-md hover:bg-blue-700 transition-all text-bold text-white text-xl mb-10"
          onClick={() => userLogin()}
        >
          Submit
        </button>
        <p>
          Do you have your account? If not,&nbsp;
          <Link
            href="/register"
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

export default Login;
