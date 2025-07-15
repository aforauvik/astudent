"use client";

import CurrentDateTime from "./TimeDate";
import TimerModal from "./TimerModal";
import ThemeToggle from "./ThemeToggle";

import {useEffect, useState, Fragment, useRef} from "react";
import {useRouter} from "next/navigation";
import {supabase} from "@/lib/supabaseClient";
import {IoMdPower} from "react-icons/io";
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
import {BsSun, BsMoon} from "react-icons/bs";

import {IoMdSunny} from "react-icons/io";
import {IoMdMoon} from "react-icons/io";

export default function TestNavBar() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [showTimerModal, setShowTimerModal] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);

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

	useEffect(() => {
		// Check for saved theme preference or default to light mode
		const savedTheme = localStorage.getItem("theme");
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;

		console.log("Theme initialization:", {savedTheme, prefersDark});

		if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
			setIsDarkMode(true);
			document.documentElement.classList.add("dark");
			console.log("Setting dark mode");
		} else {
			setIsDarkMode(false);
			document.documentElement.classList.remove("dark");
			console.log("Setting light mode");
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = !isDarkMode;
		setIsDarkMode(newTheme);
		console.log("Toggling theme to:", newTheme ? "dark" : "light");

		if (newTheme) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push("/");
	};

	return (
		<header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 px-4 dark:bg-neutral-900 transition-colors duration-300">
			<nav className="max-w-[120rem] w-full mx-auto flex flex-wrap basis-full items-center justify-between">
				<div className="flex gap-4 items-center justify-between">
					{logo}
					<h1 className="text-base text-gray-800 dark:text-white font-semibold hidden sm:block transition-colors duration-300">
						Day Planner
					</h1>

					{/* <CurrentDateTime /> */}
				</div>
				<div className="flex flex-wrap gap-4 items-center justify-between">
					{user && (
						<p className="text-base font-semibold text-neutral-800 dark:text-neutral-400 transition-colors duration-300">
							👋{" "}
							<span className="dark:text-white transition-colors duration-300">
								{user.user_metadata?.display_name || user.email}
							</span>
						</p>
					)}
					<div className="sm:order-3 flex items-center gap-x-2">
						{/* Hamburger menu for all screen sizes */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="p-2 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-300"
							aria-label="Open menu"
						>
							{mobileMenuOpen ? (
								<HiX className="text-2xl transition-transform duration-300" />
							) : (
								<HiMenu className="text-2xl transition-transform duration-300" />
							)}
						</button>
					</div>
					{/* Dropdown menu for all screen sizes */}
					{mobileMenuOpen && (
						<div className="absolute top-16 right-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-lg z-50 min-w-[80px] flex flex-col justify-start items-start p-1 gap-2 transition-all duration-300">
							{/* Theme toggle in dropdown */}
							<ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
							<div className="w-full border-t border-gray-200 dark:border-neutral-800"></div>
							{user ? (
								<button
									onClick={() => {
										setMobileMenuOpen(false);
										handleSignOut();
									}}
									className={
										"p-3 w-full text-sm font-semibold rounded-lg border border-transparent text-red-500 hover:bg-red-100 focus:outline-none focus:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-red-800/30 dark:hover:text-red-400 dark:focus:bg-red-800/30 dark:focus:text-red-400 flex items-center gap-2 justify-start text-left"
									}
								>
									<div className="bg-red-500/25 p-1 rounded-lg">
										<IoMdPower className="text-base" />
									</div>
									Sign Out
								</button>
							) : (
								<button
									onClick={() => {
										setMobileMenuOpen(false);
										router.push("/signin");
									}}
									className={
										secondaryButton +
										" w-full flex items-center gap-2 justify-start text-left"
									}
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
