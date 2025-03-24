/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
    // comment out the line below when testing with npm run dev
    output: 'export', // Ensures static export for Firebase Hosting
    trailingSlash: true, // Helps with Firebase Hosting routing
};
