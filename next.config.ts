import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,          // ⬅️ crea /about/index.html, /contact/index.html, ecc.
  images: { unoptimized: true }, // ⬅️ necessario per export statico
};

export default nextConfig;