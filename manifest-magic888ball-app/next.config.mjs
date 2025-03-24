/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
    output: 'export', // Ensures static export for Firebase Hosting
    trailingSlash: true, // Helps with Firebase Hosting routing
};
