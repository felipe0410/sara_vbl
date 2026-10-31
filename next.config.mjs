/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sitio 100 % estático: `next build` deja todo en out/ y Firebase Hosting lo sirve tal cual.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
