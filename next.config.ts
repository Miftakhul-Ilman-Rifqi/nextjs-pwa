import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    disable: false,
    register: true,
    fallbacks: {
        document: "/~offline",
    },
    extendDefaultRuntimeCaching: true,
    workboxOptions: {
        runtimeCaching: [
            {
                urlPattern:
                    /^(http:\/\/localhost:3000|https:\/\/nextjs-pwa-card\.mirifqi\.my\.id)\/api\/.*$/,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "api-cache",
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 300,
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
            {
                urlPattern:
                    /^(http:\/\/localhost:3000|https:\/\/nextjs-pwa-card\.mirifqi\.my\.id)\/_next\/.*$/,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "next-static",
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 86400,
                    },
                },
            },
            {
                urlPattern:
                    /^(http:\/\/localhost:3000|https:\/\/nextjs-pwa-card\.mirifqi\.my\.id)\/.*$/,
                handler: "NetworkFirst",
                options: {
                    cacheName: "pages-cache",
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 604800,
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
            // Tambahkan rute navigasi khusus untuk menangani rute yang belum pernah dikunjungi
            {
                urlPattern: ({ url }) => {
                    const isSameDomain = url.origin === self.location.origin;
                    return (
                        isSameDomain && url.pathname.startsWith("/customer/")
                    );
                },
                handler: "NetworkOnly",
                options: {
                    cacheName: "customer-pages",
                    plugins: [
                        {
                            handlerDidError: async () => {
                                return caches.match("/~offline");
                            },
                        },
                    ],
                },
            },
            // Default navigation fallback untuk semua rute
            {
                urlPattern: ({ request, url }) => {
                    return (
                        request.mode === "navigate" &&
                        url.origin === self.location.origin
                    );
                },
                handler: "NetworkOnly",
                options: {
                    cacheName: "navigation-fallback",
                    plugins: [
                        {
                            handlerDidError: async () => {
                                return caches.match("/~offline");
                            },
                        },
                    ],
                },
            },
        ],
    },
});

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["nextjs-pwa-card.mirifqi.my.id"],
    },
};

export default withPWA(nextConfig);
