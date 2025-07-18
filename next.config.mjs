import createPWA from "next-pwa";

const withPWA = createPWA({
	dest: "public",
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
	// Add any other Next.js config options here
};

export default withPWA(nextConfig);
