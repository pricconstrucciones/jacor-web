import type { NextConfig } from "next";

// Sitio público estático: se genera en `out/` y no tiene servidor, sesión ni acceso a la base de datos de la gestión.
const nextConfig: NextConfig = {
  output: "export",
  // El build usa su propia carpeta: así no pisa la de `next dev` si los dos corren a la vez.
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",
  poweredByHeader: false,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
