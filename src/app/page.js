"use client";

import {useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {supabase} from "../lib/supabaseClient";
import SignIn from "@/components/SignIn";
import Footer from "@/components/Footer";
import Image from "next/image";
import Landing from "@/components/Landing";

export default function Home() {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		// Redirect authenticated users to dashboard, but not if they're in a reset flow
		const checkAuth = async () => {
			const resetParam = searchParams.get("reset");
			const {data} = await supabase.auth.getSession();

			// If user has a session and reset param is present, redirect to reset password page
			if (data?.session && resetParam === "true") {
				router.push("/reset-password?reset=true");
			} else if (data?.session) {
				// Normal authenticated user, redirect to dashboard
				router.push("/dashboard");
			}
		};
		checkAuth();
	}, [router, searchParams]);

	return (
		<>
			{/* <SignIn />
			<Footer /> */}
			<Landing />
		</>
	);
}
