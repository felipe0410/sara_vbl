/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sitio 100 % estático: `next build` deja todo en out/ y Firebase Hosting lo sirve tal cual.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // "1" solo para probar contra los emuladores locales (npm run dev:emuladores).
  env: { NEXT_PUBLIC_EMULADOR: process.env.NEXT_PUBLIC_EMULADOR ?? "0" },
};

export default nextConfig;
