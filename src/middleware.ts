import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPubliceRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/home",
  "/",
])

const isPublicApiRoutes = createRouteMatcher([
  "/api/video"
])

export default clerkMiddleware((auth, req) => {
  const {userId} = auth();
  const currentUrl = new URL(req.url)
  const isAccessingDashboard = currentUrl.pathname === "/home"
  const isApiRequest = currentUrl.pathname.startsWith("/api")

  //if user is logged-in and accessing public routes but not dashboard or home 
  if (userId && isPubliceRoute(req) &&!isAccessingDashboard) {
    return NextResponse.redirect(new URL("/home", req.url))
  }
  //user is not logged-in 
  if (!userId) {
    //if user is not logged-in and try to access protected routes 
    if (!isPubliceRoute(req) && !isPublicApiRoutes(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }
    //if user is not logged-in and try to request protected api routes
    if (isApiRequest && !isPublicApiRoutes(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }
  }
  return NextResponse.next()
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};