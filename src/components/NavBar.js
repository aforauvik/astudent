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
				{user && (
					<p className="text-sm font-semibold text-neutral-400">
						❤️ Welcome,{" "}
						<span className="dark:text-white">
							{user.user_metadata?.display_name || user.email}
						</span>
					</p>
				)}
				<div className="sm:order-3 flex items-center gap-x-2">
					{user ? (
						<button onClick={handleSignOut} className={logOut}>
							Sign Out
						</button>
					) : (
						<button onClick={() => router.push("/signin")} className={logIn}>
							Sign In
						</button>
					)}
				</div>
				<div
					id="hs-navbar-alignment"
					className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:grow-0 sm:basis-auto sm:block sm:order-2"
					aria-labelledby="hs-navbar-alignment-collapse"
				></div>
			</nav>
		</header>
	);
}
