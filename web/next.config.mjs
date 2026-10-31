import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// Lets `npm run dev` use a local copy of the D1 database, so you can test
// on your PC exactly like the live site.
initOpenNextCloudflareForDev();
