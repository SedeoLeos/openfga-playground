/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";




import { MiddlewarePipeline } from "./middleware/middleware.pipe";
import { authMiddleware } from "./middleware/auth.middleware";
import { proxyReverseMiddleware } from "./middleware/proxy-reverse.middleware";


const pipeline = new MiddlewarePipeline()
  .use(["/user"], authMiddleware) // Apply authMiddleware for these paths ATTENTION: should not set "/" at the end of the path
  .use(["/api"], proxyReverseMiddleware)

// .use(["/refresh"], refreshTokenAction);

export async function middleware(request: NextRequest, response: NextResponse) {
  return pipeline.run(request);

}

export const config = {
  matcher: ["/:path*"],
};