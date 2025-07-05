"use client";

import CurrentDateTime from "./TimeDate";
import TimerModal from "./TimerModal";

import {useEffect, useState, Fragment, useRef} from "react";
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
	logo,
} from "../app/AllStyles";

import {LuAlarmClock} from "react-icons/lu";
import {IoIosCloseCircle} from "react-icons/io";
import {HiMenu, HiX} from "react-icons/hi";

export default function TestNavBar() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [showTimerModal, setShowTimerModal] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
		<header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 px-4 dark:bg-neutral-900">
			<nav className="max-w-[120rem] w-full mx-auto flex flex-wrap basis-full items-center justify-between">
				<div className="flex gap-4 items-center justify-between">
					{logo}
					<h1 className="text-base font-semibold hidden sm:block">
						Day Planner
					</h1>

					{/* <CurrentDateTime /> */}
				</div>
				<div className="flex flex-wrap gap-4 items-center justify-between">
					{user && (
						<p className="text-base font-semibold text-neutral-400">
							👋{" "}
							<span className="dark:text-white">
								{user.user_metadata?.display_name || user.email}
							</span>
						</p>
					)}
					<div className="sm:order-3 flex items-center gap-x-2">
						{/* Hamburger menu for all screen sizes */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="p-2 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800"
							aria-label="Open menu"
						>
							{mobileMenuOpen ? (
								<HiX className="text-2xl" />
							) : (
								<HiMenu className="text-2xl" />
							)}
						</button>
					</div>
					{/* Dropdown menu for all screen sizes */}
					{mobileMenuOpen && (
						<div className="absolute top-16 right-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-lg z-50 min-w-[80px] flex flex-col p-1 gap-2">
							{user ? (
								<button
									onClick={() => {
										setMobileMenuOpen(false);
										handleSignOut();
									}}
									className={destructiveButton}
								>
									Sign Out
								</button>
							) : (
								<button
									onClick={() => {
										setMobileMenuOpen(false);
										router.push("/signin");
									}}
									className={secondaryButton}
								>
									Sign In
								</button>
							)}
						</div>
					)}
				</div>
			</nav>
		</header>
	);
}
