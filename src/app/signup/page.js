"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {supabase} from "@/lib/supabaseClient";

import SignUp from "@/components/SignUp";

export default function SignUpPage() {
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
	return <SignUp />;
}
