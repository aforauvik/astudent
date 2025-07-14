/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/preline/preline.js",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
		},
	},
	plugins: [require("preline/plugin"), require("@tailwindcss/forms")],
};
