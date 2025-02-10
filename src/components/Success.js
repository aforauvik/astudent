"use client";

import {useEffect} from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {inputStyle, logo} from "../app/AllStyles";
import Footer from "./Footer";

export default function Success() {
	useEffect(() => {
		// Fire a burst of confetti on component mount
		confetti({
			particleCount: 150,
			spread: 60,
			origin: {y: 0.6},
		});
	}, []);

	return (
		<div className="max-w-[50rem] flex flex-col mx-auto h-screen size-full">
			<header className="mb-auto flex justify-center z-50 w-full py-4">
				<nav className="px-4 sm:px-6 lg:px-8">
					<Link href="/">
						<div className="flex justify-center mb-6">{logo}</div>
					</Link>
					<h1 className="text-base font-semibold hidden sm:block">
						Day Planner
					</h1>
				</nav>
			</header>

			<main id="content">
				<div className="text-center py-4 px-4 sm:px-6 lg:px-8">
					<h1 className="block text-7xl font-bold text-gray-800 sm:text-9xl dark:text-white">
						Success!
					</h1>
					<p className="mt-3 text-gray-600 dark:text-neutral-400">
						If you have entered a valid email address, you will receive a
						confirmation email. <br /> Please check both inbox and spam folder.
					</p>

					<div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
						<Link
							href="/signin"
							className="w-full sm:w-auto py-3 px-4 inline-flex justify-center font-bold items-center gap-x-2 text-sm rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
						>
							Go To Sign In Page
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
