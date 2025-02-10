import Link from "next/link";
import React from "react";
import Image from "next/image";
import Footer from "./Footer";

function Landing() {
	return (
		<div className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 bg-[url('https://preline.co/assets/svg/examples/squared-bg-element.svg')] bg-no-repeat bg-top size-full bg-white transform before:-translate-x-1/2">
			<div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
				<div className="flex justify-center">
					<Link
						className="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-xs text-gray-600 p-2 px-3 rounded-full transition hover:border-gray-300 focus:outline-none focus:border-gray-300"
						href="/signin"
					>
						Productivity Starts Here
						<span className="flex items-center gap-x-1">
							<span className="border-s border-gray-200 text-blue-600 ps-2">
								Get Started
							</span>
							<svg
								className="shrink-0 size-4 text-blue-600"
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
								<path d="m9 18 6-6-6-6" />
							</svg>
						</span>
					</Link>
				</div>

				<div className="mt-5 max-w-xl text-center mx-auto">
					<h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl">
						Simple Day Planner
					</h1>
				</div>

				<div className="mt-5 max-w-3xl text-center mx-auto">
					<p className="text-lg text-gray-600">
						Simplify your day: Break down tasks, master <br /> your schedule,
						and enjoy stress-free productivity.
					</p>
				</div>

				<div className="mt-8 gap-3 flex justify-center">
					<Link
						className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 focus:outline-none focus:from-violet-600 focus:to-blue-600 border border-transparent text-white text-base font-semibold rounded-full py-3 px-6"
						href="/signin"
					>
						🎉 Let's Get Started
					</Link>
				</div>

				<div className="flex justify-center">
					<Image src="/og.png" width={863} height={615} alt="App screenshot" />
				</div>

				<footer className="mt-auto w-full py-10 px-4 sm:px-6 lg:px-8 mx-auto">
					<div className="text-center">
						<div className="w-full py-4 border-t border-gray-200"></div>

						<div className="">
							<p className="text-xs font-semibold text-gray-500 dark:text-neutral-500">
								Designed & Developed In <br /> North Carolina By{" "}
								<Link
									className="text-orange-400 decoration-2 hover:underline focus:outline-none focus:underline font-semibold dark:text-orange-400"
									href="https://www.auvik.me/"
									target="blank"
								>
									Auvik Mir
								</Link>
							</p>
							<p className="text-xs font-semibold text-gray-500 dark:text-neutral-500">
								Copyright © {new Date().getFullYear()}
							</p>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}

export default Landing;
