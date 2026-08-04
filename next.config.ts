import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Lets you open the dev server from another device on the same network, which
     is the only honest way to check the frosted navigation and the project
     stack on a real phone. Development only; it has no effect on a build. */
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.0.0/16", "10.0.0.0/8"],
};

export default nextConfig;
