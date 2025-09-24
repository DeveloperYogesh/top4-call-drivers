// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const redirectTo = url.origin + "/"; // change to "/login" if you prefer

    const res = NextResponse.redirect(redirectTo);

    // `clearAuthCookie()` from your auth.ts returns a cookie-string for 'token'
    res.headers.set("Set-Cookie", clearAuthCookie());

    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ status: "error", message: "Logout failed. Please try again." }, { status: 500 });
  }
}
