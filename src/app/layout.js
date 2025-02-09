import {Open_Sans} from "next/font/google";
import "./globals.css";

const bgColor = "bg-neutral-50 dark:bg-neutral-950";

const openSans = Open_Sans({
	subsets: ["latin"],
	weight: ["300", "400", "600", "700"],
	variable: "--font-open-sans", // Optional: define a CSS variable
});

export const metadata = {
	title: "Day Planner",
	description:
		"This web app is inspired by the book How to Be a Straight A Student by Cal Newport. The book highlights strategies for academic success, including noting down daily tasks, writing down things to remember, and tracking progress on ongoing projects. This app is designed to help students put these strategies into practice in their academic life.",
	image: "/og.png",
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
