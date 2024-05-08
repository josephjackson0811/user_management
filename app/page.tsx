import { Box, Container } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box
      className="inset-0 w-full object-cover"
      style={{
        backgroundImage: "url('./background.jpg')",
        height: "auto",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container className="text-center py-96">
        <Box>
          <p className=" text-9xl">Mountain</p>
          <Box>
            <button className=" border-blue-500 px-5 py-3 bg-blue-500 rounded-md hover:bg-blue-700 transition-all mr-40">
              <Link href="/login" className="text-xl font-bold text-white">
                Login
              </Link>
            </button>
            <button className=" border-green-500 px-5 py-3 bg-green-500 hover:bg-green-700 rounded-md transition-all">
              <Link href="/register" className="text-xl font-bold text-white">
                Register
              </Link>
            </button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
