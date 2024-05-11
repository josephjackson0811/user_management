'use client';

import { ArrowBack } from '@mui/icons-material';
import { Box, Container, TextField } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';

import { isValidEmail } from '@/libs/email-validation';

const Register = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const userRegister = () => {
    if (password.length < 6 || password.length > 30) {
      alert('Password Must Contain Between 6 ~ 30 Characters.');
    } else if (!isValidEmail(id)) {
      alert('Invalid Email.');
    } else {
      if (password !== passwordConfirm) {
        alert('Password Incorrect');
      } else {
        const userData = {
          id: id.toString(),
          name: name.toString(),
          password: password.toString(),
        };

        axios
          .post('/api/users/register', userData)
          .then((data) => {
            if (!data.data.success) {
              alert(data.data.message);
            } else {
              const info = data.data;

              window.location.href = '/login';
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <Box className="relative">
      <Link href="/" className="absolute top-10 left-10 flex items-center text-lg hover:text-blue-700 p-2">
        <ArrowBack /> back
      </Link>
      <Container className="px-96">
        <Container className="flex flex-col justify-around items-center pt-24">
          <p className=" text-8xl mb-32">Register</p>
          <TextField fullWidth label="User Name" onChange={(e) => setName(e.target.value)} className="mb-16" />
          <TextField fullWidth label="Email" onChange={(e) => setId(e.target.value)} className="mb-16" />
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
            REGISTER
          </button>
          <p>
            Do you have your account already? If so,&nbsp;
            <Link href="/login" className="underline hover:text-gray-300 transition-all">
              Click Here
            </Link>{' '}
            to login now
          </p>
        </Container>
      </Container>
    </Box>
  );
};

export default Register;
