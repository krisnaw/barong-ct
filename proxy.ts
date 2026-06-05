import {NextRequest, NextResponse} from "next/server";
import {headers} from "next/headers";
import {auth} from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if(!session) {
    return NextResponse.redirect(new URL("/auth/signup", request.url));
  }

  const allowedEmails = ["krisna.w2010@gmail.com", "helces@gmail.com"]

  if (request.nextUrl.pathname.startsWith("/dashboard") && !allowedEmails.includes(session.user.email)) {
    return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile"], // Specify the routes the middleware applies to
};