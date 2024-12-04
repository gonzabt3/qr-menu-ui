/** @type {import('next').NextConfig} */
const nextConfig = {
  // Uncomment the following line to build a static site.
  // output: "export",

  reactStrictMode: true,
  transpilePackages: ['@mercadopago/sdk-react'],
};

export default nextConfig;
