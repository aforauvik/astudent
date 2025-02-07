"use client";

import Link from "next/link";

export default function Success() {
	return (
		<div className="max-w-[50rem] flex flex-col mx-auto size-full">
			{/* HEADER */}
			<header className="mb-auto flex justify-center z-50 w-full py-4">
				<nav className="px-4 sm:px-6 lg:px-8">
					<Link
						href="/"
						className="flex-none text-xl font-semibold sm:text-3xl dark:text-white"
						aria-label="Brand"
					>
						A Student
					</Link>
				</nav>
			</header>

			{/* MAIN CONTENT */}
			<main id="content">
				<div className="text-center py-10 px-4 sm:px-6 lg:px-8">
					<h1 className="block text-7xl font-bold text-gray-800 sm:text-9xl dark:text-white">
						Success!
					</h1>
					<p className="mt-3 text-gray-600 dark:text-neutral-400">
						If you have entered a valid email address, you will receive a
						confirmtion email. <br /> Please check both inbox and spam folder.
					</p>

					<div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
						<Link
							href="/"
							className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
						>
							<svg
								className="shrink-0 size-4"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="m15 18-6-6 6-6" />
							</svg>
							Go To Sign In Page
						</Link>
					</div>
				</div>
			</main>

			{/* FOOTER */}
			<footer className="mt-auto text-center py-5">
				<div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
					<p className="text-sm text-gray-500 dark:text-neutral-500">
						© All Rights Reserved. {new Date().getFullYear()}.
					</p>
				</div>
			</footer>
		</div>
	);
}
