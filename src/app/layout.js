import {Open_Sans} from "next/font/google";
import "./globals.css";

const bgColor = "bg-neutral-50 dark:bg-neutral-950";

const openSans = Open_Sans({
	subsets: ["latin"],
	weight: ["300", "400", "600", "700"],
	variable: "--font-open-sans", // Optional: define a CSS variable
});

export const metadata = {
	title: "A Student | Day Planner",
	description: "Day Planner",
};

export default function RootLayout({children}) {
	return (
		<html lang="en">
			<body className={`${openSans.variable} ${bgColor} antialiased`}>
				{children}
			</body>
		</html>
	);
}
