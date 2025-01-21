import { NextRequest } from "next/server";
import { updateSession } from "./app/_libs/utils/supabase/middleware";

export async function middleware(req: NextRequest) {
  return updateSession(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|p).*)",
  ],
};
