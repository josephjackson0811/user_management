"use client";

import { Box } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [loggedUser, setLoggedUser] = useState(true);

  useEffect(() => {
    const access = window.localStorage.getItem("accessToken");
    const refresh = window.localStorage.getItem("refreshToken");

    console.log(!access);

    if (!access || !refresh) {
      setLoggedUser(false);
    }
  }, []);

  const logout = () => {
    setLoggedUser(false);
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("accessToken");
  };

  return (
    <Box className="absolute top-0 p-5 flex items-center justify-between w-full">
      <Box>image</Box>
      <Box>
        {loggedUser ? (
          <>
            <button
              className=" border-blue-500 px-5 py-3 bg-blue-500 rounded-md hover:bg-blue-700 transition-all mr-12 text-xl font-bold text-white"
              onClick={() => logout()}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button className=" border-blue-500 px-5 py-3 bg-blue-500 rounded-md hover:bg-blue-700 transition-all mr-12">
              <Link href="/login" className="text-xl font-bold text-white">
                Login
              </Link>
            </button>
            <button className=" border-green-500 px-5 py-3 bg-green-500 hover:bg-green-700 rounded-md transition-all">
              <Link href="/register" className="text-xl font-bold text-white">
                Register
              </Link>
            </button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Header;
