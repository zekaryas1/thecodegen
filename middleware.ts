export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/project",
    "/project/:path*",
    "/api/project",
    "/api/project/:path*",
  ],
};
