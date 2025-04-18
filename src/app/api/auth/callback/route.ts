import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);

    // Redirect to the dashboard after successful authentication
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If there's no code, redirect to the signin page
  return NextResponse.redirect(new URL("/signin", request.url));
}
