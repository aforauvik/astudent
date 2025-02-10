import React from "react";
import Link from "next/link";

function Footer() {
	return (
		<footer className="mt-auto w-full py-10 px-4 sm:px-6 lg:px-8 mx-auto">
			<div className="text-center">
				<div className="w-full py-4 border-t border-gray-200 dark:border-neutral-900"></div>
				<div>
					<Link
						className="flex-none text-base font-semibold text-black dark:text-white"
						href="/"
						aria-label="Brand"
					>
						Day Planner
					</Link>
				</div>

				<div className="mt-3">
					<p className="text-xs font-semibold text-gray-500 dark:text-neutral-500">
						Designed & Developed In North Carolina By{" "}
						<Link
							className="text-orange-400 decoration-2 hover:underline focus:outline-none focus:underline font-bold dark:text-orange-400"
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
	);
}

export default Footer;
