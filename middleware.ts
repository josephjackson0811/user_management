import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'
 
interface Token extends JwtPayload {
    iat: number,
    exp: number,
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const access = request.headers.get('access') || "";
  const refresh = request.headers.get('refresh') || "";

  const decodedAccess = jwt.decode(access) as Token;
  // verify(access, "secret1")
  // console.log(decodedAccess)
  const decodedRefresh = jwt.decode(refresh) as Token;

  //   if(refresh !== "") {
  //       if(decodedRefresh?.exp - new Date().getTime() / 1000 < 0) {
  //           return Response.json({ message: 'Refresh Token Expired.', success: false, data: {}, type: "token" });
  //     } else {
  //       return NextResponse.next();
  //     }
  //   }

  // if((decodedAccess.exp - new Date().getTime() / 1000) < 0) {
  //     return Response.json({ message: 'Access Token Expired.', success: false, data: {}, type: "token" });
  // } else {
    return NextResponse.next();
  // }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/foods/:path*',
}