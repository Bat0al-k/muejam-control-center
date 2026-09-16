// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     // ─── Experimental Features ───────────────────────────────────────────────
//     experimental: {
//         typedRoutes: true,
//     },

//     // ─── Images ──────────────────────────────────────────────────────────────
//     images: {
//         remotePatterns: [
//             {
//                 protocol: "https",
//                 hostname: "**.supabase.co",
//             },
//             {
//                 protocol: "https",
//                 hostname: "avatars.githubusercontent.com",
//             },
//         ],
//     },

//     // ─── Environment Variables (public) ──────────────────────────────────────
//     env: {
//         NEXT_PUBLIC_APP_NAME: "Company Control Center",
//     },

//     // ─── Redirects ────────────────────────────────────────────────────────────
//     async redirects() {
//         return [
//             {
//                 source: "/",
//                 destination: "/dashboard",
//                 permanent: false,
//             },
//         ];
//     },

//     // ─── Headers ─────────────────────────────────────────────────────────────
//     async headers() {
//         return [
//             {
//                 source: "/(.*)",
//                 headers: [
//                     { key: "X-Frame-Options", value: "DENY" },
//                     { key: "X-Content-Type-Options", value: "nosniff" },
//                     { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//                     {
//                         key: "Permissions-Policy",
//                         value: "camera=(), microphone=(), geolocation=()",
//                     },
//                 ],
//             },
//         ];
//     },
// };

// module.exports = nextConfig;



// for make the root page appear
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
