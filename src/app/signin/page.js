"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {supabase} from "@/lib/supabaseClient";
import SignIn from "@/components/SignIn";
import Footer from "@/components/Footer";

export default function SignInPage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect authenticated users to dashboard
		const checkAuth = async () => {
			const {data} = await supabase.auth.getSession();
			if (data?.session) {
				router.push("/dashboard");
			}
		};
		checkAuth();
	}, []);
	return (
		<div className="">
			<SignIn />
			<Footer />
		</div>
	);
}
