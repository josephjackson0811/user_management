"use client";

import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function Home() {
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
    window.localStorage.removeItem("refreshToken");
  };

  // const t = useTranslations("Showcase");

  return (
    <Box
      className="relative inset-0 w-full object-cover"
      style={{
        backgroundImage: "url('./background.jpg')",
        height: "auto",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container className="text-center pt-80 pb-[500px]">
        <Box>
          <p className=" text-9xl mb-20">Welcome</p>
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
                  <Link
                    href="/register"
                    className="text-xl font-bold text-white"
                  >
                    Register
                  </Link>
                </button>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
