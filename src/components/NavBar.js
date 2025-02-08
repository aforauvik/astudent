"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {supabase} from "@/lib/supabaseClient";
import {
	inputStyle,
	smallButton,
	addButton,
	destructiveButton,
	secondaryButton,
	logOut,
	logIn,
} from "../app/AllStyles";

export default function TestNavBar() {
	const router = useRouter();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const checkUser = async () => {
			const {data} = await supabase.auth.getSession();
			if (!data?.session) {
				router.push("/signin");
			} else {
				setUser(data.session.user);
			}
		};
		checkUser();
	}, []);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push("/");
	};

	return (
		<header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-900">
			<nav className="max-w-[85rem] w-full mx-auto flex flex-wrap basis-full items-center justify-between">
				<div className="flex gap-4 items-center justify-between">
					<svg
						width="40"
						height="40"
						viewBox="0 0 1000 1000"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clipPath="url(#clip0_545_7519)">
							<rect
								width="1000"
								height="1000"
								rx="200"
								fill="url(#paint0_linear_545_7519)"
							/>
							<path
								d="M650 250H350C322.375 250 300 272.375 300 300V325H275C261.2 325 250 336.2 250 350C250 363.8 261.2 375 275 375H300C313.8 375 325 386.2 325 400C325 413.8 313.8 425 300 425H275C261.2 425 250 436.2 250 450C250 463.8 261.2 475 275 475H300C313.8 475 325 486.2 325 500C325 513.8 313.8 525 300 525H275C261.2 525 250 536.2 250 550C250 563.8 261.2 575 275 575H300C313.8 575 325 586.2 325 600C325 613.8 313.8 625 300 625H275C261.2 625 250 636.2 250 650C250 663.8 261.2 675 275 675H300V700C300 727.625 322.375 750 350 750H650C677.625 750 700 727.625 700 700V300C700 272.375 677.625 250 650 250ZM575 425H425C411.2 425 400 413.8 400 400C400 386.2 411.2 375 425 375H575C588.8 375 600 386.2 600 400C600 413.8 588.8 425 575 425Z"
								fill="white"
							/>
						</g>
						<defs>
							<linearGradient
								id="paint0_linear_545_7519"
								x1="-500"
								y1="500"
								x2="500"
								y2="1500"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#38B8F2" />
								<stop offset="1" stopColor="#623CF6" />
							</linearGradient>
							<clipPath id="clip0_545_7519">
								<rect width="1000" height="1000" fill="white" />
							</clipPath>
						</defs>
					</svg>
					<h1 className="text-base font-semibold">A Student Planner</h1>
				</div>
				<div className="flex flex-wrap gap-2 items-center justify-between">
					{user && (
						<p className="text-base font-semibold text-neutral-400">
							❤️ Welcome,{" "}
							<span className="dark:text-white">
								{user.user_metadata?.display_name || user.email}
							</span>
						</p>
					)}
					<div className="sm:order-3 flex items-center gap-x-2">
						{user ? (
							<button onClick={handleSignOut} className={destructiveButton}>
								Sign Out
							</button>
						) : (
							<button
								onClick={() => router.push("/signin")}
								className={secondaryButton}
							>
								Sign In
							</button>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
