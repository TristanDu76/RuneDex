/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: '/home/zone01student/Desktop/projet-perso/runedex', 
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
      },
    ],
  },
};

module.exports = nextConfig;