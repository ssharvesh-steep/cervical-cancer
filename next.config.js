/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'moglmxolvmbcmdktrerl.supabase.co',
            },
        ],
    },
    // Allow cross-origin requests from local network devices (for mobile testing)
    allowedDevOrigins: ['192.168.1.3'],
    // Turbopack configuration (empty to silence warnings)
    turbopack: {},
}

module.exports = nextConfig
