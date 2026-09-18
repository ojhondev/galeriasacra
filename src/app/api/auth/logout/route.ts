import { NextResponse } from "next/server";
import { destruirSessao } from "@/lib/session";

export async function POST(request: Request) {
  await destruirSessao();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
