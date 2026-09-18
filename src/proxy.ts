import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verificarToken } from "@/lib/session";

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const sessao = token ? await verificarToken(token) : null;

  if (!sessao || sessao.role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
