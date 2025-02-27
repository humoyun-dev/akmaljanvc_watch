import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the request is for the Telegram API endpoint
  if (request.nextUrl.pathname === "/api/telegram") {
    // Add rate limiting headers
    const response = NextResponse.next();

    response.headers.set("X-RateLimit-Limit", "60");
    response.headers.set("X-RateLimit-Remaining", "59");
    response.headers.set("X-RateLimit-Reset", "60");

    return response;
  }

  return NextResponse.next();
}

// Configure the middleware to only run on the Telegram API route
export const config = {
  matcher: "/api/telegram",
};
